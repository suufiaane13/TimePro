import ExcelJS from 'exceljs'
import { formatOreExport, type ExportPayload } from '@/utils/exportData'
import type { Profil } from '@/types'

const COLORS = {
  title: 'FFC00000',
  header: 'FF7B0C02',
  refBg: 'FF1F3864',
  saturdayBg: 'FFE2EFDA',
  saturdayText: 'FF375623',
  extraBg: 'FFFFC7CE',
  extraText: 'FF9C0006',
  totalBg: 'FFC00000',
  white: 'FFFFFFFF',
  border: 'FFD0D0D0',
}

function thinBorder(): Partial<ExcelJS.Borders> {
  const side: Partial<ExcelJS.Border> = { style: 'thin', color: { argb: COLORS.border } }
  return { top: side, left: side, bottom: side, right: side }
}

function fillCell(
  cell: ExcelJS.Cell,
  value: string | number,
  opts?: {
    bold?: boolean
    bg?: string
    color?: string
    align?: Partial<ExcelJS.Alignment>
  },
) {
  cell.value = value
  cell.font = {
    bold: opts?.bold,
    color: opts?.color ? { argb: opts.color } : undefined,
  }
  if (opts?.bg) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opts.bg } }
  cell.alignment = { vertical: 'middle', ...opts?.align }
  cell.border = thinBorder()
}

export async function buildExcel(
  payload: ExportPayload,
  profil: Profil,
): Promise<Blob> {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Presenze', {
    views: [{ rightToLeft: false }],
  })

  ws.columns = [
    { width: 12 },
    { width: 14 },
    { width: 14 },
    { width: 14 },
    { width: 12 },
    { width: 12 },
    { width: 14 },
    { width: 14 },
    { width: 18 },
  ]

  ws.mergeCells('A1:I1')
  const titleCell = ws.getCell('A1')
  titleCell.value = 'REGISTRO PRESENZE E ORE STRAORDINARIE'
  titleCell.font = { bold: true, color: { argb: COLORS.title }, size: 14 }
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' }

  const ref = profil.horaireRef
  const refText = `Lun-Ven: ${ref.debutMatin}-${ref.finMatin} / ${ref.debutPm}-${ref.finPm}`
  ws.mergeCells('A2:I2')
  fillCell(ws.getCell('A2'), refText, {
    bg: COLORS.refBg,
    color: COLORS.white,
    align: { horizontal: 'center' },
  })

  ws.getCell('A3').value = 'Dipendente:'
  ws.getCell('B3').value = `${profil.prenom} ${profil.nom}`
  ws.getCell('D3').value = 'Periodo:'
  ws.getCell('E3').value = payload.periode
  ws.getCell('G3').value = 'Nazione:'
  ws.getCell('H3').value = profil.pays

  const headers = [
    'Data',
    'Giorno',
    'Entrata mattina',
    'Uscita mattina',
    'Entrata PM',
    'Uscita PM',
    'Ore lavorate',
    'Ore normali',
    'Ore straordinarie',
  ]
  const headerRow = 5
  headers.forEach((h, i) => {
    fillCell(ws.getCell(headerRow, i + 1), h, {
      bold: true,
      bg: COLORS.header,
      color: COLORS.white,
      align: { horizontal: 'center' },
    })
  })

  let rowNum = headerRow + 1
  for (const row of payload.rows) {
    const values = [
      row.data,
      row.giorno,
      row.entreeMatin,
      row.sortieMatin,
      row.entreePm,
      row.sortiePm,
      formatOreExport(row.oreLavorate),
      formatOreExport(row.oreNormali),
      formatOreExport(row.oreStraordinarie),
    ]
    values.forEach((v, i) => {
      const cell = ws.getCell(rowNum, i + 1)
      const isExtraCol = i === 8
      fillCell(cell, v, {
        bg: row.estSamedi ? COLORS.saturdayBg : undefined,
        color: row.estSamedi ? COLORS.saturdayText : isExtraCol && row.oreStraordinarie > 0 ? COLORS.extraText : undefined,
        align: { horizontal: i >= 6 ? 'center' : 'left' },
      })
      if (isExtraCol && row.oreStraordinarie > 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.extraBg } }
        cell.font = { color: { argb: COLORS.extraText } }
      }
    })
    rowNum++
  }

  // TOTALE GENERALE : fusion Data + Giorno (A:B) — C:F restent vides sans fond rouge
  ws.mergeCells(rowNum, 1, rowNum, 2)
  fillCell(ws.getCell(rowNum, 1), 'TOTALE GENERALE', {
    bold: true,
    bg: COLORS.totalBg,
    color: COLORS.white,
    align: { horizontal: 'center' },
  })
  ;[7, 8, 9].forEach((col, i) => {
    const vals = [
      payload.totaux.lavorate,
      payload.totaux.normali,
      payload.totaux.straordinarie,
    ]
    const text = formatOreExport(vals[i])
    const hasValue = Math.round(vals[i] * 60) > 0
    fillCell(ws.getCell(rowNum, col), text, {
      bold: hasValue,
      bg: hasValue ? COLORS.totalBg : undefined,
      color: hasValue ? COLORS.white : undefined,
      align: { horizontal: 'center' },
    })
  })

  const buffer = await wb.xlsx.writeBuffer()
  return new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
}

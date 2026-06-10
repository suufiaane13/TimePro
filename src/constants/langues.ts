import type { LangueUI } from '@/types'

export const LANGUES: LangueUI[] = ['it', 'ar']

export const LANG_META: Record<
  LangueUI,
  { label: string; code: string; descriptionIt: string; descriptionAr: string }
> = {
  it: {
    label: 'Italiano',
    code: 'IT',
    descriptionIt: 'Interfaccia in italiano',
    descriptionAr: 'واجهة بالإيطالي',
  },
  ar: {
    label: 'الدارجة المغربية',
    code: 'MA',
    descriptionIt: 'Interfaccia in darija marocchina (RTL)',
    descriptionAr: 'واجهة بالدارجة المغربية',
  },
}

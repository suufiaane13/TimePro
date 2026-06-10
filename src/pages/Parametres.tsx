import { Clock, Palette, Shield, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PageHeader } from '@/components/PageHeader'
import { ThemeSelector } from '@/components/ThemeToggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { usePresences } from '@/store/usePresences'
import { horaireRefInvalide } from '@/utils/validateHeures'

export default function ParametresPage() {
  const { t } = useTranslation()
  const profil = usePresences((s) => s.profil)
  const setProfil = usePresences((s) => s.setProfil)
  const dimancheActif = usePresences((s) => s.dimancheActif)
  const setDimancheActif = usePresences((s) => s.setDimancheActif)

  const updateHoraire = (field: keyof typeof profil.horaireRef, value: string) => {
    const next = { ...profil.horaireRef, [field]: value }
    if (horaireRefInvalide(next)) {
      toast.error(t('parametres.horaireInvalide'))
      return
    }
    setProfil({ horaireRef: next })
  }

  return (
    <div className="space-y-5">
      <PageHeader title={t('parametres.title')} description={t('parametres.subtitle')} />

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Palette className="size-5 text-primary" />
            {t('parametres.theme')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">{t('parametres.themeDesc')}</p>
          <ThemeSelector />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <User className="size-5 text-primary" />
            {t('parametres.identite')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom">{t('parametres.nom')}</Label>
              <Input
                id="nom"
                className="h-12 text-base"
                value={profil.nom}
                onChange={(e) => setProfil({ nom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">{t('parametres.prenom')}</Label>
              <Input
                id="prenom"
                className="h-12 text-base"
                value={profil.prenom}
                onChange={(e) => setProfil({ prenom: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pays">{t('parametres.pays')}</Label>
            <Input
              id="pays"
              className="h-12 text-base"
              value={profil.pays}
              onChange={(e) => setProfil({ pays: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Clock className="size-5 text-primary" />
            {t('parametres.horaire')}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          {(
            [
              ['debutMatin', t('parametres.debutMatin')],
              ['finMatin', t('parametres.finMatin')],
              ['debutPm', t('parametres.debutPm')],
              ['finPm', t('parametres.finPm')],
            ] as const
          ).map(([field, label]) => (
            <div key={field} className="space-y-2">
              <Label htmlFor={field}>{label}</Label>
              <Input
                id={field}
                type="time"
                className="h-12 text-base"
                value={profil.horaireRef[field]}
                onChange={(e) => updateHoraire(field, e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div className="min-w-0 flex-1 space-y-1">
            <Label htmlFor="dimanche" className="text-sm font-medium">
              {t('parametres.dimanche')}
            </Label>
            <p className="text-xs leading-snug text-muted-foreground">
              {t('parametres.dimancheDesc')}
            </p>
          </div>
          <Switch
            id="dimanche"
            checked={dimancheActif}
            onCheckedChange={setDimancheActif}
            aria-label={t('parametres.dimanche')}
          />
        </CardContent>
      </Card>

      <Card className="border-dashed">
        <CardContent className="flex items-start gap-3 py-4">
          <Shield className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <p className="text-xs leading-relaxed text-muted-foreground">{t('parametres.privacy')}</p>
        </CardContent>
      </Card>
    </div>
  )
}

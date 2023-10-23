import { Alert } from '@navikt/ds-react'

import { AlertContainerBred } from '../../../../../felleskomponenter/AlertContainer'
import { Etikett } from '../../../../../felleskomponenter/typografi'
import { Vilkår, VilkårsResultat } from '../../../../../types/types.internal'
import { Vilkårbeskrivelser } from './Vilkårbeskrivelser'

export const Oppsummering = ({ oppsummertResultat, vilkår }: OppsummeringProps) => {
  const alertBoksType =
    oppsummertResultat === VilkårsResultat.JA
      ? 'success'
      : oppsummertResultat === VilkårsResultat.NEI
      ? 'info'
      : 'warning'

  return (
    <AlertContainerBred>
      <Alert variant={alertBoksType} size="small">
        {AlertTekst(oppsummertResultat)}
        <Vilkårbeskrivelser vilkår={vilkår} resultat={oppsummertResultat} />
      </Alert>
    </AlertContainerBred>
  )
}

function AlertTekst(oppsummertResultat: VilkårsResultat) {
  switch (oppsummertResultat) {
    case VilkårsResultat.JA:
      return <Etikett>Alle vilkårene er oppfylt</Etikett>
    case VilkårsResultat.NEI:
      return <Etikett>Søknaden vil bli avslått fordi det finnes vilkår som ikke er oppfylt:</Etikett>
    case VilkårsResultat.DOKUMENTASJON_MANGLER:
      return <Etikett>Søknaden vil bli avslått fordi det mangler nødvendige opplysninger til å fatte vedtak:</Etikett>
    case VilkårsResultat.KANSKJE:
      return <Etikett>Noen av vilkårende må vurderes</Etikett>
  }
}

interface OppsummeringProps {
  oppsummertResultat: VilkårsResultat
  vilkår: Vilkår[]
}

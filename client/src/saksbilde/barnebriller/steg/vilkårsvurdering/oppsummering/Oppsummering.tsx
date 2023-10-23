import { Alert } from '@navikt/ds-react'

import { AlertContainerBred } from '../../../../../felleskomponenter/AlertContainer'
import { Etikett } from '../../../../../felleskomponenter/typografi'
import { Vilkår, VilkårsResultat } from '../../../../../types/types.internal'
import { Vilkårbeskrivelser } from './Vilkårbeskrivelser'

export const Oppsummering = ({ oppsummertResultat, vilkår }: OppSummeringProps) => {
  const alertBoksType =
    oppsummertResultat === VilkårsResultat.JA
      ? 'success'
      : oppsummertResultat === VilkårsResultat.NEI
      ? 'info'
      : 'warning'

  return (
    <AlertContainerBred>
      <Alert variant={alertBoksType} size="small">
        {AlertTekst(alertBoksType)}
        <Vilkårbeskrivelser vilkår={vilkår} resultat={oppsummertResultat} />
      </Alert>
    </AlertContainerBred>
  )
}

function AlertTekst(alertVariant: 'success' | 'warning' | 'info') {
  switch (alertVariant) {
    case 'success':
      return <Etikett>Alle vilkårene er oppfylt</Etikett>
    case 'info':
      return <Etikett>Søknaden vil bli avslått fordi det finnes vilkår som ikke er oppfylt:</Etikett>
    case 'warning':
      return <Etikett>Noen av vilkårende må vurderes</Etikett>
  }
}

interface OppSummeringProps {
  oppsummertResultat: VilkårsResultat
  vilkår: Vilkår[]
}

import { Alert } from '@navikt/ds-react'

import { AlertContainerBred } from '../../../../../felleskomponenter/AlertContainer'
import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../../felleskomponenter/typografi'
import { Vilkår, VilkårsResultat } from '../../../../../types/types.internal'
import { Vilkårbeskrivelser } from './Vilkårbeskrivelser'

export const Oppsummering = ({ oppsummertResultat, vilkår }: OppSummeringProps) => {
  const opplysningspliktOppfylt =
    vilkår.find((v) => v.vilkårId === 'MEDLEMMETS_OPPLYSNINGSPLIKT')?.resultatAuto === VilkårsResultat.JA

  const alertBoksType =
    oppsummertResultat === VilkårsResultat.JA
      ? 'success'
      : oppsummertResultat === VilkårsResultat.NEI
      ? 'info'
      : 'warning'

  return (
    <AlertContainerBred>
      <Alert variant={alertBoksType} size="small">
        <Brødtekst>{AlertTekst(alertBoksType, opplysningspliktOppfylt)}</Brødtekst>
        {opplysningspliktOppfylt && oppsummertResultat === VilkårsResultat.JA && (
          <Avstand paddingTop={3}>
            <Vilkårbeskrivelser vilkår={vilkår} resultat={oppsummertResultat} />
          </Avstand>
        )}
      </Alert>
    </AlertContainerBred>
  )
}

function AlertTekst(alertVariant: 'success' | 'warning' | 'info', opplysningspliktOppfylt: boolean) {
  if (!opplysningspliktOppfylt) {
    return (
      <Brødtekst>Siden vilkåret for opplysningsplikt ikke er oppfylt, skal ikke de andre vilkårene vurderes</Brødtekst>
    )
  }

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

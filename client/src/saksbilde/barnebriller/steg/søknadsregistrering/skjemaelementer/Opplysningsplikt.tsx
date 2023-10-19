import { Controller, useFormContext } from 'react-hook-form'

import { Alert, Radio, RadioGroup } from '@navikt/ds-react'

import { formaterDato } from '../../../../../utils/date'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { Brødtekst, Etikett } from '../../../../../felleskomponenter/typografi'
import { Vurdering, VilkårsResultat } from '../../../../../types/types.internal'

export function Opplysningsplikt({ brevSendtDato }: { brevSendtDato: string }) {
  const { control, watch } = useFormContext<{ opplysningsplikt: Vurdering }>()

  const opplysningsplikt = watch('opplysningsplikt')

  return (
    <Avstand paddingTop={6}>
      <Etikett>Innbyggers opplysningsplikt (frtl. $ 21-3)</Etikett>
      <Avstand paddingTop={4} />

      <>
        <Alert variant="info" size="small">
          <Brødtekst>{`Brev for å innhente opplysninger ble sendt ${formaterDato(
            brevSendtDato
          )}. Hvis innbygger ikke sender de manglende opplysningene innen
        3 uker fra brevet ble mottatt, er ikke opplysningsplikten oppfylt.`}</Brødtekst>
        </Alert>
        <Avstand paddingBottom={6} />
      </>
      <Controller
        name="opplysningsplikt.vilkårOppfylt"
        control={control}
        render={({ field }) => (
          <RadioGroup legend="Er opplysningsplikten oppfylt?" size="small" {...field}>
            <Radio value={VilkårsResultat.JA}>Ja</Radio>
            <Radio value={VilkårsResultat.NEI}>Nei</Radio>
          </RadioGroup>
        )}
      />
      {opplysningsplikt.vilkårOppfylt === VilkårsResultat.NEI && (
        <Avstand paddingTop={6}>
          <Alert variant="warning" size="small">
            Denne vurderingen vil gjøre at søkeren får avslag med begrunnelsen at opplysningsplikten ikke er oppfylt
            (ftrl. $ 21-3)
          </Alert>
        </Avstand>
      )}
    </Avstand>
  )
}

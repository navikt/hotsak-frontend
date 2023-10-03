import { Controller, useFormContext } from 'react-hook-form'

import { Alert, Radio, RadioGroup } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { ManuellVurdering, VilkårsResultat } from '../../../../../types/types.internal'

export function Opplysningsplikt() {
  const { control, watch } = useFormContext<{ opplysningsplikt: ManuellVurdering }>()

  const opplysningsplikt = watch('opplysningsplikt')

  return (
    <Avstand paddingTop={6}>
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

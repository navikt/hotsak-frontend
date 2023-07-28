import { Controller, useFormContext } from 'react-hook-form'

import { Radio, RadioGroup } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { VilkårsResultat } from '../../../../../types/types.internal'

export function OpplysningspliktOppfylt() {
  const { control } = useFormContext<{ opplysningspliktOppfylt: boolean }>()

  return (
    <Avstand paddingTop={6}>
      <Controller
        name="opplysningspliktOppfylt"
        control={control}
        render={({ field }) => (
          <RadioGroup legend="Er opplysningsplikten oppfylt?" size="small" {...field}>
            <Radio value={VilkårsResultat.JA}>Ja</Radio>
            <Radio value={VilkårsResultat.NEI}>Nei</Radio>
          </RadioGroup>
        )}
      />
    </Avstand>
  )
}

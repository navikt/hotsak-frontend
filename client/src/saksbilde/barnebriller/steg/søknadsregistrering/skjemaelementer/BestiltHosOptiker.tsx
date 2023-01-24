import { Controller, useFormContext } from 'react-hook-form'

import { Heading, Radio, RadioGroup } from '@navikt/ds-react'

import { VilkårSvar } from '../../../../../types/types.internal'

export function BestiltHosOptiker() {
  const {
    control,
    formState: { errors },
  } = useFormContext<{ bestiltHosOptiker: VilkårSvar }>()

  return (
    <>
      <Heading level="2" size="xsmall" spacing>
        § 2 Brillen må være bestilt hos optiker
      </Heading>
      <Controller
        name="bestiltHosOptiker"
        control={control}
        rules={{ required: 'Velg en verdi' }}
        render={({ field }) => (
          <RadioGroup
            legend="Er brillen bestilt hos optiker"
            size="small"
            {...field}
            error={errors.bestiltHosOptiker?.message}
          >
            <Radio value={VilkårSvar.JA}>Ja</Radio>
            <Radio value={VilkårSvar.NEI}>Nei</Radio>
            <Radio value={VilkårSvar.DOKUMENTASJON_MANGLER}>Dokumentasjon mangler</Radio>
          </RadioGroup>
        )}
      />
    </>
  )
}

import { Controller, useFormContext } from 'react-hook-form'
import { errorSelector } from 'recoil'

import { Heading, Radio, RadioGroup } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { VilkårSvar } from '../../../../../types/types.internal'

export function KomplettBrille() {
  const {
    control,
    formState: { errors },
  } = useFormContext<{ komplettBrille: VilkårSvar }>()

  return (
    <>
      <Avstand paddingTop={6}>
        <Heading level="2" size="xsmall" spacing>
          § 2 Komplett brille
        </Heading>
        <Controller
          name="komplettBrille"
          control={control}
          rules={{ required: 'Velg en verdi' }}
          render={({ field }) => (
            <RadioGroup
              legend="Er det en komplett brille?"
              size="small"
              {...field}
              error={errors.komplettBrille?.message}
            >
              <Radio value={VilkårSvar.JA}>Ja</Radio>
              <Radio value={VilkårSvar.NEI}>Nei</Radio>
              <Radio value={VilkårSvar.DOKUMENTASJON_MANGLER}>Dokumentasjon mangler</Radio>
            </RadioGroup>
          )}
        />
      </Avstand>
    </>
  )
}

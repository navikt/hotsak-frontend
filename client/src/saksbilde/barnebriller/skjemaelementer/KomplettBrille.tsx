import { Controller, useFormContext } from 'react-hook-form'

import { Heading, Radio, RadioGroup } from '@navikt/ds-react'

import { VilkårSvar } from '../../../types/types.internal'

export function KomplettBrille() {
  const { control } = useFormContext<{ komplettBrille: VilkårSvar }>()

  return (
    <>
      <Heading level="2" size="xsmall" spacing>
        § 2 Komplett brille
      </Heading>
      <Controller
        name="komplettBrille"
        control={control}
        render={({ field }) => (
          <RadioGroup legend="Er det en komplett brille?" size="small" {...field}>
            <Radio value={VilkårSvar.JA}>Ja</Radio>
            <Radio value={VilkårSvar.NEI}>Nei</Radio>
            <Radio value={VilkårSvar.DOKUMENTASJON_MANGLER}>Dokumentasjon mangler</Radio>
          </RadioGroup>
        )}
      />
    </>
  )
}

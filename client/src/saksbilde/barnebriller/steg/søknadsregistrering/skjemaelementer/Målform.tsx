import { Controller, useFormContext } from 'react-hook-form'

import { Radio, RadioGroup } from '@navikt/ds-react'

import { MålformType } from '../../../../../types/types.internal'

export function Målform() {
  const { control } = useFormContext<{ målform: string }>()

  return (
    <Controller
      name="målform"
      control={control}
      render={({ field }) => (
        <RadioGroup legend="Målform" size="small" {...field}>
          <Radio value={MålformType.BOKMÅL}>Bokmål</Radio>
          <Radio value={MålformType.NYNORSK}>Nynorsk</Radio>
        </RadioGroup>
      )}
    />
  )
}

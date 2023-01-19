import { Controller, useFormContext } from 'react-hook-form'

import { Radio, RadioGroup } from '@navikt/ds-react'

import { MålformType } from '../../../types/types.internal'

export function Målform() {
  const { control } = useFormContext<{ maalform: string }>()

  return (
    <Controller
      name="maalform"
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

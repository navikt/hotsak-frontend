import { Controller, useFormContext } from 'react-hook-form'

import { Radio, RadioGroup } from '@navikt/ds-react'

export function Målform() {
  const { control } = useFormContext<{ maalform: string }>()

  return (
    <Controller
      name="maalform"
      control={control}
      render={({ field }) => (
        <RadioGroup legend="Målform" size="small" {...field}>
          <Radio value="bokmål">Bokmål</Radio>
          <Radio value="nynorsk">Nynorsk</Radio>
        </RadioGroup>
      )}
    />
  )
}

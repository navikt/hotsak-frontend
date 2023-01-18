import { Controller, useFormContext } from 'react-hook-form'

import { Radio, RadioGroup, UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react'

export function Bestillingsdato() {
  const { control, setValue } = useFormContext<{ bestillingsdato?: Date }>()

  const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
    toDate: new Date(),
    fromDate: new Date('Aug 1 2022'),
    onDateChange: (dato) =>
      setValue('bestillingsdato', dato, { shouldDirty: true, shouldTouch: true, shouldValidate: true }),
  })

  return (
    <UNSAFE_DatePicker dropdownCaption {...datepickerProps}>
      <UNSAFE_DatePicker.Input
        {...inputProps}
        size="small"
        label="Bestillingsdato"
        id="bestillingsdato"
        value={inputProps.value}
      />
    </UNSAFE_DatePicker>
  )
}

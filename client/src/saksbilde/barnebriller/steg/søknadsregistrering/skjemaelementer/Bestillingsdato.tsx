import { useFormContext } from 'react-hook-form'

import { UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react'

export function Bestillingsdato() {
  const { formState, setValue, setError } = useFormContext<{ bestillingsdato?: Date }>()

  const { errors } = formState

  const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
    toDate: new Date(),
    fromDate: new Date('Aug 1 2022'),
    onDateChange: (dato) =>
      setValue('bestillingsdato', dato, { shouldDirty: true, shouldTouch: true, shouldValidate: true }),

    onValidate: (val) => {
      if (!val.isValidDate) {
        setError('bestillingsdato', { type: 'custom', message: 'Ugyldig bestillingsdato ' })
      }

      //errors?.bestillingsdato.message = 'Ugyldig bestillingsdato'
    },
    required: true,
  })

  return (
    <UNSAFE_DatePicker dropdownCaption {...datepickerProps}>
      <UNSAFE_DatePicker.Input
        {...inputProps}
        size="small"
        label="Bestillingsdato"
        id="bestillingsdato"
        value={inputProps.value}
        error={errors.bestillingsdato?.message}
      />
    </UNSAFE_DatePicker>
  )
}

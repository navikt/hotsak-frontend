import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { DatePicker, useDatepicker } from '@navikt/ds-react'

export function Bestillingsdato() {
  const { formState, setValue, setError, clearErrors, watch } = useFormContext<{ bestillingsdato: Date }>()
  const { errors } = formState

  const valgtDato = watch('bestillingsdato')

  useEffect(() => {
    if (formState.errors.bestillingsdato && valgtDato) {
      clearErrors('bestillingsdato')
    }
  }, [formState, valgtDato, clearErrors])

  const { datepickerProps, inputProps } = useDatepicker({
    fromDate: new Date('Jan 1 1970'),
    toDate: new Date(),
    onDateChange: (dato) => {
      setValue('bestillingsdato', dato!, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
    },

    onValidate: (val) => {
      if (!val.isEmpty && !val.isValidDate) {
        setError('bestillingsdato', { type: 'custom', message: 'Ugyldig bestillingsdato' })
      }
    },
    required: true,
    defaultSelected: formState.defaultValues?.bestillingsdato,
  })

  return (
    <DatePicker dropdownCaption {...datepickerProps}>
      <DatePicker.Input
        {...inputProps}
        size="small"
        label="Brillens bestillingsdato"
        id="bestillingsdato"
        value={inputProps.value}
        error={errors.bestillingsdato?.message}
      />
    </DatePicker>
  )
}

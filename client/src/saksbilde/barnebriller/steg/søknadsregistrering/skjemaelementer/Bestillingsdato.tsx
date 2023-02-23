import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { UNSAFE_DatePicker, UNSAFE_useDatepicker } from '@navikt/ds-react'

export function Bestillingsdato() {
  const { formState, setValue, setError, clearErrors, watch } = useFormContext<{ bestillingsdato?: Date }>()
  const { errors } = formState

  const Valgtdato = watch('bestillingsdato')

  useEffect(() => {
    if (formState.isSubmitting && !Valgtdato) {
      setError('bestillingsdato', { type: 'custom', message: 'Ingen bestillingsdato valgt' })
    } else if (formState.errors.bestillingsdato && Valgtdato) {
      clearErrors('bestillingsdato')
    }
  }, [formState, Valgtdato])

  const { datepickerProps, inputProps } = UNSAFE_useDatepicker({
    toDate: new Date(),
    onDateChange: (dato) =>
      setValue('bestillingsdato', dato, { shouldDirty: true, shouldTouch: true, shouldValidate: true }),

    onValidate: (val) => {
      console.log('validerer')

      if (!val.isValidDate) {
        setError('bestillingsdato', { type: 'custom', message: 'Ugyldig bestillingsdato' })
      }
    },
    required: true,
  })

  return (
    <UNSAFE_DatePicker dropdownCaption {...datepickerProps}>
      <UNSAFE_DatePicker.Input
        {...inputProps}
        size="small"
        label="Brillens bestillingsdato"
        id="bestillingsdato"
        value={inputProps.value}
        error={errors.bestillingsdato?.message}
      />
    </UNSAFE_DatePicker>
  )
}

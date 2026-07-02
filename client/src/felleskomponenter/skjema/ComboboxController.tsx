import { type FieldPath, type FieldValues, useController, type UseControllerProps } from 'react-hook-form'
import { UNSAFE_Combobox, type ComboboxProps } from '@navikt/ds-react'

export interface ComboboxOption {
  label: string
  value: string
}

export interface ComboboxControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>
  extends
    Omit<
      ComboboxProps,
      keyof UseControllerProps | 'options' | 'selectedOptions' | 'onToggleSelected' | 'isMultiSelect' | 'allowNewValues'
    >,
    UseControllerProps<TFieldValues, TName, TTransformedValues> {
  options: ComboboxOption[]
}

export function ComboboxController<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(props: ComboboxControllerProps<TFieldValues, TName, TTransformedValues>) {
  const { name, rules, shouldUnregister, defaultValue, control, disabled, exact, options, ...rest } = props
  const { field, fieldState } = useController({ name, rules, shouldUnregister, defaultValue, control, disabled, exact })

  const selectedOption = options.find((o) => o.value === field.value)

  return (
    <UNSAFE_Combobox
      error={fieldState.error?.message}
      shouldAutocomplete
      allowNewValues={false}
      {...rest}
      options={options}
      selectedOptions={selectedOption ? [selectedOption] : []}
      onToggleSelected={(value, isSelected) => field.onChange(isSelected ? value : '')}
    />
  )
}

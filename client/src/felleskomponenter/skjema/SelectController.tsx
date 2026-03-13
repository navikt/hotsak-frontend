import { type FieldPath, type FieldValues, useController, type UseControllerProps } from 'react-hook-form'
import { Select, type SelectProps } from '@navikt/ds-react'

export interface SelectControllerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>
  extends Omit<SelectProps, keyof UseControllerProps>, UseControllerProps<TFieldValues, TName, TTransformedValues> {}

export function SelectController<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(props: SelectControllerProps<TFieldValues, TName, TTransformedValues>) {
  const { name, rules, shouldUnregister, defaultValue, control, disabled, exact, children, ...rest } = props
  const { field, fieldState } = useController({ name, rules, shouldUnregister, defaultValue, control, disabled, exact })
  return (
    <Select error={fieldState.error?.message} {...rest} {...field}>
      {children}
    </Select>
  )
}

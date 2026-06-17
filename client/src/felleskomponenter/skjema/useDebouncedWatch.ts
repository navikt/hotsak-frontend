import { useWatch, type Control, type FieldPath, type FieldPathValue, type FieldValues } from 'react-hook-form'

import { useDebouncedValue } from './useDebouncedValue'

export function useDebouncedWatch<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>(
  props: { name: TFieldName; control: Control<TFieldValues, unknown, TTransformedValues> },
  delay: number
): FieldPathValue<TFieldValues, TFieldName> {
  const value = useWatch<TFieldValues, TFieldName, TTransformedValues>(props)
  return useDebouncedValue(value, delay)
}

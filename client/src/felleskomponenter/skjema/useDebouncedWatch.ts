import { useEffect, useState } from 'react'
import { useWatch, type Control, type FieldPath, type FieldPathValues, type FieldValues } from 'react-hook-form'

export function useDebouncedWatch<
  TFieldValues extends FieldValues = FieldValues,
  TFieldNames extends readonly FieldPath<TFieldValues>[] = readonly FieldPath<TFieldValues>[],
  TTransformedValues = TFieldValues,
>(
  {
    name,
    control,
  }: {
    name: readonly [...TFieldNames]
    control?: Control<TFieldValues, unknown, TTransformedValues>
  },
  delay: number
): FieldPathValues<TFieldValues, TFieldNames> {
  const value = useWatch<TFieldValues, TFieldNames, TTransformedValues>({ name, control })
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

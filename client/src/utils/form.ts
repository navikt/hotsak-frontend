import { useActionState } from 'react'

import { isString } from './type.ts'

export function extractFormValues<T extends Record<string, any>>(data: FormData): T {
  const values: Record<string, any> = {}
  data.forEach((value, key) => {
    if (isString(value)) {
      values[key] = value
    }
  })
  return values as T
}

export function useFormActionState<FormState, FormValues extends Record<string, any>>(
  action: (state: Awaited<FormState>, payload: FormValues) => FormState | Promise<FormState>,
  initialState: Awaited<FormState>
) {
  return useActionState<FormState, FormData>((state, data) => {
    const payload = extractFormValues<FormValues>(data)
    return action(state, payload)
  }, initialState)
}

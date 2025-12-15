export function replacer(_: string, value: any) {
  if (value instanceof Set) {
    return [...value]
  }
  return value
}

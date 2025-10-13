export function FormatertDato({ dato }: { dato?: string }) {
  if (!dato) {
    return null
  }
  const formatertDato = new Date(dato).toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return <time dateTime={dato}>{formatertDato}</time>
}

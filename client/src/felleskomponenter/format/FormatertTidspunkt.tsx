export function FormatertTidspunkt({ dato }: { dato?: string }) {
  if (!dato) {
    return null
  }
  const formatertTidspunkt = new Date(dato).toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  return <time dateTime={dato}>{formatertTidspunkt}</time>
}

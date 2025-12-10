export function FormatDateTime({ dateTime }: { dateTime?: string }) {
  if (!dateTime) {
    return null
  }
  const formatted = new Date(dateTime).toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  return <time dateTime={dateTime}>{formatted}</time>
}

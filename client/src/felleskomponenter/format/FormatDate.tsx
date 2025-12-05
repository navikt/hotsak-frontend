export function FormatDate({ date }: { date?: string }) {
  if (!date) {
    return null
  }
  const formatted = new Date(date).toLocaleDateString('nb-NO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return <time dateTime={date}>{formatted}</time>
}

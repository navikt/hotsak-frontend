import { MAX_SFÆRE, MAX_STYRKE, MAX_SYLINDER, MIN_STYRKE } from './config'

interface FormatertStyrkeProps {
  verdi?: number | string
  type: 'sfære' | 'sylinder'
}

export function FormatertStyrke(props: FormatertStyrkeProps) {
  const { verdi, type } = props
  if (verdi == null || verdi === '') {
    return null
  }
  switch (type) {
    case 'sfære':
      return <>{formater(+Number(verdi), +1, +MAX_SFÆRE)}</>
    case 'sylinder':
      return <>{formater(-Number(verdi), -1, -MAX_SYLINDER)}</>
    default:
      return null
  }
}

function formater(verdi: number, min: number, max: number) {
  const styrke = Math.abs(verdi)
  if (styrke === MIN_STYRKE) {
    return `Under ${formatter.format(min)}`
  }
  if (styrke === MAX_STYRKE) {
    return `Over ${formatter.format(max)}`
  }
  return formatter.format(verdi)
}

const formatter = new Intl.NumberFormat('nb', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

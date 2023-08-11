interface FormatertStyrkeProps {
  verdi?: number | string
}

export function FormatertStyrke(props: FormatertStyrkeProps) {
  const { verdi } = props
  if (verdi == null || verdi === '') {
    return null
  }

  return <>{formatter.format(Number(verdi))}</>
}

const formatter = new Intl.NumberFormat('nb', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
})

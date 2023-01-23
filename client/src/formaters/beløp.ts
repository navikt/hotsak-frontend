const formatter = new Intl.NumberFormat('nb', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formater(verdi?: number | string): string {
  if (!verdi) {
    return ''
  } else {
    let value = ''
    if (typeof verdi === 'number') {
      value = formatter.format(verdi)
    } else {
      value = formatter.format(Number(byttDesimaltegn(verdi)))
    }
    if (value.endsWith(',00')) value = value.substring(0, value.length - 3)
    return value
  }
}

function byttDesimaltegn(verdi: string): string {
  return verdi.replace(',', '.')
}

export const beløp = {
  formater,
  byttDesimaltegn,
}

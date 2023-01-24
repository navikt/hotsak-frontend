export const validering = {
  /*fnr(verdi: string): boolean {
      return fnr(verdi).status === 'valid'
    },
    dato(verdi: string): boolean {
      return isValid(dato.tilDate(verdi))
    },*/
  beløp(verdi: string): boolean {
    return /^\d+(,\d{1,2})?$/.test(verdi)
  },
}

export function validator(test: (verdi: string, nå: Date) => boolean, error: string): (verdi: string) => true | string {
  return (verdi) => {
    return test(verdi, new Date()) || error
  }
}

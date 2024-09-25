export function useEkstraTelefonnummer(pdlTelefon?: string, søknadTelefon?: string) {
  return pdlTelefon && pdlTelefon !== søknadTelefon ? søknadTelefon : null
}

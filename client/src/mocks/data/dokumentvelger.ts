export interface DokumentFil {
  filsti: string // relativ til src/mocks/data/pdf/
}

export function velgDokumentFil(journalpostId: string, dokumentId: string): DokumentFil {
  if (journalpostId === '9004') {
    return { filsti: 'hjelpemidler_søknad.pdf' }
  }
  switch (dokumentId) {
    case '2':
      return { filsti: 'barnebriller_kvittering.pdf' }
    case '3':
      return { filsti: 'barnebriller_brilleseddel.pdf' }
    case '4':
      return { filsti: 'barnebriller_kvitteringsside.pdf' }
    case '6':
      return { filsti: 'journalført_notat.pdf' }
    case '5':
    default:
      return { filsti: 'barnebriller_søknad.pdf' }
  }
}

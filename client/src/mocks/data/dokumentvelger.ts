import { HJELPEMIDDEL_JOURNALPOST_IDS } from './lagJournalpost.ts'

export interface DokumentFil {
  filsti: string // relativ til src/mocks/data/pdf/
}

const BARNEBRILLE_DOKUMENTER = [
  'barnebriller_søknad.pdf',
  'barnebriller_brilleseddel.pdf',
  'barnebriller_kvittering.pdf',
] as const

export function velgDokumentFil(journalpostId: string, dokumentId: string): DokumentFil {
  if ((HJELPEMIDDEL_JOURNALPOST_IDS as readonly string[]).includes(journalpostId)) {
    return { filsti: 'hjelpemidler_søknad.pdf' }
  }
  if (dokumentId === '6') {
    return { filsti: 'journalført_notat.pdf' }
  }
  const idx = (parseInt(dokumentId) - 1) % BARNEBRILLE_DOKUMENTER.length
  return { filsti: BARNEBRILLE_DOKUMENTER[idx] ?? 'barnebriller_søknad.pdf' }
}

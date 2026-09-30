import { type Dokument } from '../types/types.internal.ts'

export function validerDokumenttittel(tittel: string): string | undefined {
  const trimmetTittel = tittel.trim()

  if (!trimmetTittel) {
    return 'Du må skrive en dokumenttittel'
  }

  if (trimmetTittel.length < 3) {
    return 'Dokumenttittelen må ha minst 3 tegn'
  }
}

export function harUgyldigeDokumenttitler(dokumenter: Dokument[], dokumentTitler: Record<string, string>): boolean {
  return dokumenter.some(
    (dokument) => validerDokumenttittel(dokumentTitler[dokument.dokumentId] ?? dokument.tittel) !== undefined
  )
}

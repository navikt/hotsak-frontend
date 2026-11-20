import { useRef, useState } from 'react'

import { type Journalpost } from '../types/types.internal.ts'
import { harUgyldigeDokumenttitler } from './dokumenttittelValidering.ts'
import { byggDokumentPayload } from './journalføringValg.ts'

export function useDokumentredigering(journalpost: Journalpost) {
  const [dokumentTitler, setDokumentTitler] = useState<Record<string, string>>({})
  const [visTittelFeil, setVisTittelFeil] = useState(false)
  const annetInnhold = useRef<Record<string, string[]>>({})

  function settTittel(dokumentId: string, tittel: string) {
    setDokumentTitler((prev) => ({ ...prev, [dokumentId]: tittel }))
  }

  function settAnnetInnhold(dokumentId: string, innhold: string[]) {
    annetInnhold.current = { ...annetInnhold.current, [dokumentId]: innhold }
  }

  function validerTitler() {
    const gyldige = !harUgyldigeDokumenttitler(journalpost.dokumenter, dokumentTitler)
    setVisTittelFeil(!gyldige)
    return gyldige
  }

  return {
    dokumentTitler,
    visTittelFeil,
    settTittel,
    settAnnetInnhold,
    visTittelfeilmeldinger: () => setVisTittelFeil(true),
    validerTitler,
    byggDokumentPayload: () => byggDokumentPayload(journalpost, dokumentTitler, annetInnhold.current),
  }
}

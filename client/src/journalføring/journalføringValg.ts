import { type Dokument, type Journalpost } from '../types/types.internal.ts'
import { normaliserDokumenttittel } from './dokumenttittelValidering.ts'
import { Sakstype, type JournalføringV2Request, type TilordnetEnhet } from './journalføringTypes.ts'

export type Sakvalg =
  | {
      sakstype: Sakstype.GENERELL_SAK
    }
  | {
      sakstype: Sakstype.FAGSAK
      sakId: string
      fagsaksystem: string
    }

export const GOSYS_GENERELL_SAK: Sakvalg = {
  sakstype: Sakstype.GENERELL_SAK,
}

export function byggDokumentPayload(
  journalpost: Journalpost,
  dokumentTitler: Record<string, string>,
  annetInnhold: Record<string, string[]>
): Pick<JournalføringV2Request, 'tittel' | 'dokumenter'> {
  const tittel = normaliserDokumenttittel(
    dokumentTitler[journalpost.dokumenter[0]?.dokumentId ?? ''] ??
      journalpost.dokumenter[0]?.tittel ??
      journalpost.tittel
  )
  const dokumenter = journalpost.dokumenter.map((dok: Dokument) => ({
    dokumentId: dok.dokumentId,
    tittel: normaliserDokumenttittel(dokumentTitler[dok.dokumentId] ?? dok.tittel),
    annetInnhold: annetInnhold[dok.dokumentId] ?? [],
  }))
  return { tittel, dokumenter }
}

export function finnTildeltSaksbehandler(
  tilordnetEnhet: TilordnetEnhet,
  innloggetAnsattId: string,
  medarbeider?: string
): string | undefined {
  if (tilordnetEnhet === 'minOppgaveliste') return innloggetAnsattId
  if (tilordnetEnhet === 'medarbeidersOppgaveliste') return medarbeider
  return undefined
}

export function byggJournalføringSak(valgtSak: Sakvalg): NonNullable<JournalføringV2Request['sak']> {
  if (valgtSak.sakstype === Sakstype.GENERELL_SAK) {
    return { sakstype: Sakstype.GENERELL_SAK }
  }

  return {
    sakstype: Sakstype.FAGSAK,
    fagsakId: valgtSak.sakId,
    fagsaksystem: valgtSak.fagsaksystem,
  }
}

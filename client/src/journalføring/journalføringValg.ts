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

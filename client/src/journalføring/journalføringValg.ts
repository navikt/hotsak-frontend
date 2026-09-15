import { Sakstype, type JournalføringV2Request } from './journalføringTypes.ts'

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

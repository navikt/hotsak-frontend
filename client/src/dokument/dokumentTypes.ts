export const Journalposttype = {
  /** @deprecated */
  I: 'I',
  INNGÅENDE: 'INNGÅENDE',
  /** @deprecated */
  U: 'U',
  UTGÅENDE: 'UTGÅENDE',
  /** @deprecated */
  N: 'N',
  NOTAT: 'NOTAT',
} as const
export type Journalposttype = Enum<typeof Journalposttype>

export const Journalstatus = {
  MOTTATT: 'MOTTATT',
  /** @deprecated */
  JOURNALFOERT: 'JOURNALFOERT',
  JOURNALFØRT: 'JOURNALFØRT',
  FERDIGSTILT: 'FERDIGSTILT',
  EKSPEDERT: 'EKSPEDERT',
  UNDER_ARBEID: 'UNDER_ARBEID',
  FEILREGISTRERT: 'FEILREGISTRERT',
  /** @deprecated */
  UTGAAR: 'UTGAAR',
  UTGÅR: 'UTGÅR',
  AVBRUTT: 'AVBRUTT',
  UKJENT_BRUKER: 'UKJENT_BRUKER',
  RESERVERT: 'RESERVERT',
  OPPLASTING_DOKUMENT: 'OPPLASTING_DOKUMENT',
  UKJENT: 'UKJENT',
} as const
export type Journalstatus = Enum<typeof Journalstatus>

/**
 * Typer fra `hotlibs/core`.
 */

export interface Enhet {
  nummer: string
  navn: string
}

export interface Kommune {
  nummer: string
  navn: string
}

export interface Bydel {
  nummer: string
  navn: string
}

export interface Personnavn {
  fornavn: string
  mellomnavn?: string
  etternavn: string
}

export interface HarPersonnavn {
  navn: Personnavn
}

export interface Veiadresse {
  adresselinje1: string
  adresselinje2?: string
  adresselinje3?: string
  postnummer: string
  poststed: string
}

export const Kilde = {
  DIGITAL_BEHOVSMELDING: 'DIGITAL_BEHOVSMELDING',
  JOURNALPOST: 'JOURNALPOST',
} as const
export type Kilde = Enum<typeof Kilde>

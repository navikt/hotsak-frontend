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
  adresse: string
  postnummer: string
  poststed: string
}

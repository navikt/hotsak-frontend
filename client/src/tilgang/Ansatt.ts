import type { Adressebeskyttelse } from '../types/types.internal.ts'

export enum AnsattGruppe {
  TEAMDIGIHOT = 'TEAMDIGIHOT',
  HOTSAK_BRUKERE = 'HOTSAK_BRUKERE',
  HOTSAK_NASJONAL = 'HOTSAK_NASJONAL',
  HOTSAK_SAKSBEHANDLER = 'HOTSAK_SAKSBEHANDLER',
  BRILLEADMIN_BRUKERE = 'BRILLEADMIN_BRUKERE',
}

export interface AnsattEnhet {
  /**
   * objectId fra Entra ID.
   */
  readonly id: string
  readonly nummer: string
  readonly navn: string
}

/**
 * Format: /^[A-Z][0-9]{6}$/
 */
export type NavIdent = string

export interface Ansatt {
  readonly id: NavIdent
  readonly navn: string
  readonly epost: string
}

export interface InnloggetAnsatt extends Ansatt {
  readonly grupper: ReadonlyArray<AnsattGruppe>
  readonly enheter: ReadonlyArray<AnsattEnhet>
  readonly gjeldendeEnhet: AnsattEnhet
  /**
   * Graderinger saksbehandler kan behandle.
   */
  readonly gradering: ReadonlyArray<Adressebeskyttelse>
  /**
   * Alle numre fra `enheter`.
   */
  readonly enhetsnumre: ReadonlyArray<string>
  readonly erInnlogget?: boolean
}

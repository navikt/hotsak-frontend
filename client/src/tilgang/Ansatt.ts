import type { Enhet } from '../types/hotlibs.ts'
import type { Adressebeskyttelse } from '../types/types.internal.ts'

export enum AnsattGruppe {
  TEAMDIGIHOT = 'TEAMDIGIHOT',
  HOTSAK_BRUKERE = 'HOTSAK_BRUKERE',
  HOTSAK_NASJONAL = 'HOTSAK_NASJONAL',
  HOTSAK_SAKSBEHANDLER = 'HOTSAK_SAKSBEHANDLER',
  BRILLEADMIN_BRUKERE = 'BRILLEADMIN_BRUKERE',
}

/**
 * Format: /^[A-Z][0-9]{6}$/
 */
export type NavIdent = string

export function isNavIdent(value: unknown): value is NavIdent {
  if (typeof value !== 'string' || value.length !== 7) {
    return false
  }
  const [first, ...rest] = value.toUpperCase()
  return first >= 'A' && first <= 'Z' && rest.every((it) => it >= '0' && it <= '9')
}

export interface Ansatt {
  readonly id: NavIdent
  readonly navn: string
  readonly epost: string
}

export interface InnloggetAnsatt extends Ansatt {
  readonly grupper: ReadonlyArray<AnsattGruppe>
  readonly enheter: ReadonlyArray<Enhet>
  readonly gjeldendeEnhet: Enhet
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

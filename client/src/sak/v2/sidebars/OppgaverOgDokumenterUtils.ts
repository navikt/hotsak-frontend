import { intervalString, type IntervalString, tilLocalDateString } from '../../../utils/dato'

export const OppgaverOgDokumenterTabs = {
  OPPGAVER: 'OPPGAVER',
  DOKUMENTER: 'DOKUMENTER',
} as const

export const OppgaverOgDokumenterFilter = {
  SISTE_2_UKER: 'siste2uker',
  SISTE_6_MND: 'siste6mnd',
  ALLE: 'alle',
} as const

export type OppgaverOgDokumenterFilterValue =
  (typeof OppgaverOgDokumenterFilter)[keyof typeof OppgaverOgDokumenterFilter]

function periodeForFilter(filter: OppgaverOgDokumenterFilterValue): { fra: Date; til: Date } | undefined {
  const now = new Date()
  switch (filter) {
    case OppgaverOgDokumenterFilter.SISTE_2_UKER: {
      const fra = new Date(now)
      fra.setDate(fra.getDate() - 14)
      return { fra, til: now }
    }
    case OppgaverOgDokumenterFilter.SISTE_6_MND: {
      const fra = new Date(now)
      const dag = fra.getDate()
      fra.setDate(1)
      fra.setMonth(fra.getMonth() - 6)
      fra.setDate(Math.min(dag, new Date(fra.getFullYear(), fra.getMonth() + 1, 0).getDate()))
      return { fra, til: now }
    }
    case OppgaverOgDokumenterFilter.ALLE:
      return undefined
  }
}

export function opprettetIntervallForFilter(filter: OppgaverOgDokumenterFilterValue): IntervalString | undefined {
  const periode = periodeForFilter(filter)
  return periode && intervalString(periode.fra.toISOString(), periode.til.toISOString())
}

export function datoIntervallForFilter(filter: OppgaverOgDokumenterFilterValue): {
  fraDato?: string
  tilDato?: string
} {
  const periode = periodeForFilter(filter)
  if (!periode) return {}
  return { fraDato: tilLocalDateString(periode.fra), tilDato: tilLocalDateString(periode.til) }
}

export type OppgaverOgDokumenterTab = keyof typeof OppgaverOgDokumenterTabs

export interface OppgaverOgDokumenterState {
  currentTab: OppgaverOgDokumenterTab
  filter: (typeof OppgaverOgDokumenterFilter)[keyof typeof OppgaverOgDokumenterFilter]
}

export const initialState: OppgaverOgDokumenterState = {
  currentTab: OppgaverOgDokumenterTabs.OPPGAVER,
  filter: 'siste2uker',
}

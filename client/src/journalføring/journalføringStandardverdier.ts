import { type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'

export const BREVKODE_BRILLER_TIL_BARN: readonly string[] = ['NAV 10-07.34', 'NAVe 10-07.34']

export type JournalføringStandardverdier = Pick<
  JournalføringV2SkjemaVerdier,
  'behandlingstema' | 'behandlingstype' | 'tilordnetEnhet'
>

const FALLBACK_STANDARDVERDIER: JournalføringStandardverdier = {
  behandlingstema: '',
  behandlingstype: '',
  tilordnetEnhet: 'enhetensOppgaveliste',
}

const BRILLER_TIL_BARN_STANDARDVERDIER: JournalføringStandardverdier = {
  behandlingstema: 'ab0420',
  behandlingstype: 'ae0034',
  tilordnetEnhet: 'minOppgaveliste',
}

const standardverdierPerBrevkode = new Map(
  BREVKODE_BRILLER_TIL_BARN.map((brevkode) => [brevkode, BRILLER_TIL_BARN_STANDARDVERDIER] as const)
)

export function hentJournalføringStandardverdier(brevkode?: string): JournalføringStandardverdier {
  return (brevkode && standardverdierPerBrevkode.get(brevkode)) || FALLBACK_STANDARDVERDIER
}

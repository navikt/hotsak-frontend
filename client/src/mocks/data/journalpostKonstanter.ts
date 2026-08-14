// Journalposter som skal tolkes som søknader om hjelpemidler (ikke barnebriller).
// Midlertidig til vi finner en bedre måte å skille dem fra barnebriller på
export const HJELPEMIDDEL_JOURNALPOST_IDS = ['9006'] as const

/**
 * Fast fødselsnummer for brukeren på journalføringssaken (9006),
 * slik at saksoversikt-endepunktet kan returnere saker for denne brukeren.
 */
export const JOURNALFOERING_V2_BRUKER_FNR = '01010199999'

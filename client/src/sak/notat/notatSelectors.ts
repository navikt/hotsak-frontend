import { NotatType, type Notat } from './notatTyper'

export function isNotatFerdigstilt(notat: Notat): boolean {
  return Boolean(notat.ferdigstilt)
}

export function isNotatUtkast(notat: Notat): boolean {
  return !notat.ferdigstilt
}

export function isNotatType(type?: NotatType): (notat: Notat) => boolean {
  return (notat: Notat) => notat.type === type
}

export const isNotatTypeInternt = isNotatType(NotatType.INTERNT)
export const isNotatTypeJournalført = isNotatType(NotatType.JOURNALFØRT)

export function isAvventerJournalføring(notat: Notat): boolean {
  return isNotatTypeJournalført(notat) && isNotatFerdigstilt(notat) && (!notat.journalpostId || !notat.dokumentId)
}

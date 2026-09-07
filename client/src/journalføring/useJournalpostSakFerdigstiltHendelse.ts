import { useEventSource } from '../event/useEventSource'
import { SakEventType, type JournalpostSakFerdigstiltData } from '../sak/sakTypes'
import { isProd } from '../utils/useMiljø'

export function useJournalpostSakFerdigstiltHendelse(sakId?: string) {
  const sakshendelserUrl = sakId && !isProd() ? `/api/sak/${sakId}/hendelser` : null
  const { data: journalpostSakFerdigstilt, ...rest } = useEventSource<JournalpostSakFerdigstiltData>({
    url: sakshendelserUrl,
    event: SakEventType.journalpostSakFerdigstilt,
  })
  return { journalpostSakFerdigstilt, rest }
}

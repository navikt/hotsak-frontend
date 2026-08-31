import { useEventSource } from '../event/useEventSource'
import { SakEventType, type JournalpostSakFerdigstiltData } from '../sak/sakTypes'

export function useJournalpostSakFerdigstiltHendelse(sakId?: string) {
  const sakshendelserUrl =
    sakId && window.appSettings.NAIS_CLUSTER_NAME !== 'prod-gcp' ? `/api/sak/${sakId}/hendelser` : null
  const { data: journalpostSakFerdigstilt, ...rest } = useEventSource<JournalpostSakFerdigstiltData>({
    url: sakshendelserUrl,
    event: SakEventType.journalpostSakFerdigstilt,
  })
  return { journalpostSakFerdigstilt, rest }
}

import { delay, http, HttpResponse } from 'msw'
import dayjs from 'dayjs'

import {
  DokumentOppgaveStatusType,
  OmrådeFilter,
  OppgaverResponse,
  Oppgavestatus,
  OppgaveStatusType,
  Oppgavetype,
  OppgaveV2,
  SakerFilter,
} from '../../types/types.internal'
import { formatName } from '../../utils/stringFormating'
import type { StoreHandlersFactory } from '../data'
import { enheter } from '../data/enheter'

export const oppgaveHandlers: StoreHandlersFactory = ({
  journalpostStore,
  oppgaveStore,
  sakStore,
  barnebrillesakStore,
}) => [
  http.get(`/api/oppgaver-v2`, async ({ request }) => {
    const url = new URL(request.url)
    const oppgavetype = url.searchParams.get('oppgavetype')

    await delay(200)

    // Midlertidig workaround frem til vi har en mer fungerende oppgavemodell i mocken.
    // Hvis oppgavetype er journalføring, kommer kallet fra dokumentlista og da viser vi førelpig journalføringer fra Journalføringstore
    // hvis ikke henter vi alle oppgaver fra oppgavestore, men den brukes kun fra eksperimentell oppgavebenk og vi vet enda ikke helt hvordan
    // Enn så lenge er det ikke noe logikk i mocken for å holde oppgavestore oppdatert
    if (oppgavetype === 'JOURNALFØRING') {
      const journalposter = await journalpostStore.alle()
      const oppgaver: OppgaveV2[] = journalposter.map((jp) => {
        return {
          id: jp.journalpostID,
          oppgavetype: Oppgavetype.JOURNALFØRING,
          oppgavestatus: journalpostStatus2Oppgavestatus(jp.status),
          beskrivelse: jp.tittel,
          område: [OmrådeFilter.SYN],
          enhet: enheter.agder,
          saksbehandler: jp.saksbehandler,
          journalpostId: jp.journalpostID,
          frist: dayjs().add(3, 'weeks').toISOString(),
          opprettet: dayjs().toISOString(),
          bruker: {
            fnr: jp.innsender.fnr,
            fulltNavn: formatName(jp.innsender.navn),
          },
          innsender: {
            fnr: jp.innsender.fnr,
            fulltNavn: formatName(jp.innsender.navn),
          },
        }
      })

      const pagedOppgaver: OppgaverResponse = {
        oppgaver: oppgaver,
        totalCount: oppgaver.length,
      }

      return HttpResponse.json(pagedOppgaver)
    } else {
      const oppgaver = await oppgaveStore.alle()
      const pagedOppgaver: OppgaverResponse = {
        oppgaver: oppgaver,
        totalCount: oppgaver.length,
      }
      return HttpResponse.json(pagedOppgaver)
    }
  }),

  http.get(`/api/oppgaver`, async ({ request }) => {
    const url = new URL(request.url)
    const statusFilter = url.searchParams.get('status')
    const sakerFilter = url.searchParams.get('saksbehandler')
    const områdeFilter = url.searchParams.get('område')
    const sakstypeFilter = url.searchParams.get('type')
    const currentPage = Number(url.searchParams.get('page'))
    const pageSize = Number(url.searchParams.get('limit'))

    const startIndex = currentPage - 1
    const endIndex = startIndex + pageSize
    const oppgaver = [...(await sakStore.oppgaver()), ...(await barnebrillesakStore.oppgaver())]
    const filtrerteOppgaver = oppgaver
      .filter((oppgave) => (statusFilter ? oppgave.status === statusFilter : true))
      .filter((oppgave) =>
        sakerFilter && sakerFilter === SakerFilter.MINE ? oppgave.saksbehandler?.navn === 'Silje Saksbehandler' : true
      )
      .filter((oppgave) =>
        sakerFilter && sakerFilter === SakerFilter.UFORDELTE
          ? oppgave.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER
          : true
      )
      .filter((oppgave) =>
        områdeFilter ? oppgave.bruker.funksjonsnedsettelser.includes(områdeFilter.toLowerCase()) : true
      )
      .filter((oppgave) => (sakstypeFilter ? oppgave.sakstype.toLowerCase() === sakstypeFilter.toLowerCase() : true))

    const filterApplied = oppgaver.length !== filtrerteOppgaver.length

    const response = {
      oppgaver: !filterApplied ? oppgaver.slice(startIndex, endIndex) : filtrerteOppgaver.slice(startIndex, endIndex),
      totalCount: !filterApplied ? oppgaver.length : filtrerteOppgaver.length,
      pageSize: pageSize,
      currentPage: currentPage,
    }

    return HttpResponse.json(response)
  }),
]

const journalpostStatus2Oppgavestatus = (jouralpostStatus: DokumentOppgaveStatusType): Oppgavestatus => {
  switch (jouralpostStatus) {
    case DokumentOppgaveStatusType.MOTTATT:
      return Oppgavestatus.OPPRETTET
    case DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER:
    case DokumentOppgaveStatusType.AVVENTER_JOURNALFØRING:
      return Oppgavestatus.UNDER_BEHANDLING
    case DokumentOppgaveStatusType.JOURNALFØRT:
      return Oppgavestatus.FERDIGSTILT
  }
}

import { http, HttpResponse } from 'msw'

import {
  type FeilregistrerNotatRequest,
  type FerdigstillNotatRequest,
  type OppdaterNotatRequest,
  type OpprettNotatRequest,
} from '../../sak/notat/notatTyper'
import { GjenståendeOverfør } from '../../sak/v2/behandling/behandlingTyper'
import { type StoreHandlersFactory } from '../data'
import { lastDokument } from '../data/felles'
import { type SakParams } from './params'
import { delay, respondNoContent, respondPdf } from './response'

interface NotatParams extends SakParams {
  notatId: string
}

export const notatHandlers: StoreHandlersFactory = ({ notatStore, oppgaveStore, sakStore }) => [
  http.get<SakParams>(`/api/sak/:sakId/kommentarer`, async ({ params }) => {
    const kommentarer = await oppgaveStore.finnKommentarerForSak(params.sakId)
    await delay(500)
    return HttpResponse.json(kommentarer)
  }),

  http.get<SakParams>(`/api/sak/:sakId/notater`, async ({ params }) => {
    const notater = await notatStore.hentNotater(params.sakId)
    await delay(500)
    return HttpResponse.json({ notater: notater, totalElements: notater.length })
  }),

  http.post<SakParams, OpprettNotatRequest>(`/api/sak/:sakId/notater`, async ({ request, params }) => {
    const body = await request.json()

    const behandlinger = await sakStore.hentBehandlinger(params.sakId)

    if (behandlinger.length > 0) {
      const gjeldendeBehandling = behandlinger[0]

      await sakStore.oppdaterBehandling(gjeldendeBehandling.behandlingId, {
        ...gjeldendeBehandling,
        operasjoner: {
          ...gjeldendeBehandling.operasjoner,
          overfør: {
            gjenstående: [
              ...(gjeldendeBehandling.operasjoner.overfør.gjenstående || []),
              GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES,
            ],
          },
        },
      })
    }

    const notatId = await notatStore.lagreUtkast(params.sakId, body)
    const notat = await notatStore.hentNotat(notatId)
    await delay(500)
    return HttpResponse.json(notat)
  }),

  http.get<NotatParams>(`/api/sak/:sakId/notater/:notatId`, async () => {
    const buffer = await lastDokument('journalført_notat')
    await delay(500)
    return respondPdf(buffer)
  }),

  http.put<NotatParams, OppdaterNotatRequest>(`/api/sak/:sakId/notater/:notatId`, async ({ request, params }) => {
    const body = await request.json()
    await notatStore.oppdaterUtkast(params.notatId, body)
    await delay(500)
    return respondNoContent()
  }),

  http.post<NotatParams, FerdigstillNotatRequest>(
    `/api/sak/:sakId/notater/:notatId/ferdigstilling`,
    async ({ request, params }) => {
      const body = await request.json()

      await notatStore.ferdigstillNotat(params.notatId, body)
      const notater = await notatStore.alle()

      if (notater.filter((notat) => !notat.ferdigstilt).length === 0) {
        const behandlinger = await sakStore.hentBehandlinger(params.sakId)

        if (behandlinger.length > 0) {
          const gjeldendeBehandling = behandlinger[0]

          await sakStore.oppdaterBehandling(gjeldendeBehandling.behandlingId, {
            ...gjeldendeBehandling,
            operasjoner: {
              ...gjeldendeBehandling.operasjoner,
              overfør: {
                gjenstående: [
                  ...(gjeldendeBehandling.operasjoner.overfør.gjenstående || []).filter(
                    (operasjon) => operasjon !== GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES
                  ),
                ],
              },
            },
          })
        }
      }

      await delay(500)
      return respondNoContent()
    }
  ),

  http.post<NotatParams, FeilregistrerNotatRequest>(
    `/api/sak/:sakId/notater/:notatId/feilregistrering`,
    async ({ params }) => {
      await notatStore.slettNotat(params.notatId)
      await delay(500)
      return respondNoContent()
    }
  ),

  http.delete<NotatParams>(`/api/sak/:sakId/notater/:notatId`, async ({ params }) => {
    await notatStore.slettNotat(params.notatId)

    const notater = await notatStore.alle()

    if (notater.filter((notat) => !notat.ferdigstilt).length === 0) {
      const behandlinger = await sakStore.hentBehandlinger(params.sakId)

      if (behandlinger.length > 0) {
        const gjeldendeBehandling = behandlinger[0]

        await sakStore.oppdaterBehandling(gjeldendeBehandling.behandlingId, {
          ...gjeldendeBehandling,
          operasjoner: {
            ...gjeldendeBehandling.operasjoner,
            overfør: {
              gjenstående: [
                ...(gjeldendeBehandling.operasjoner.overfør.gjenstående || []).filter(
                  (operasjon) => operasjon !== GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES
                ),
              ],
            },
          },
        })
      }
    }

    await delay(100)
    return respondNoContent()
  }),
]

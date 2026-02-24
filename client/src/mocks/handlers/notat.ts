import { http, HttpResponse } from 'msw'

import type { FerdigstillNotatRequest, NotatUtkast } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { lastDokument } from '../data/felles'
import type { SakParams } from './params'
import { delay, respondNoContent, respondPdf } from './response'
import { GjenståendeOverfør } from '../../sak/v2/behandling/behandlingTyper'

interface NotatParams extends SakParams {
  notatId: string
}

export const notatHandlers: StoreHandlersFactory = ({ notatStore, sakStore }) => [
  http.post<SakParams, NotatUtkast>(`/api/sak/:sakId/notater`, async ({ request, params }) => {
    const { type, tittel, tekst, klassifisering } = await request.json()

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

    await notatStore.lagreUtkast(params.sakId, { type, tittel, tekst, klassifisering })
    await delay(500)
    return respondNoContent()
  }),

  http.post<NotatParams, FerdigstillNotatRequest>(
    `/api/sak/:sakId/notater/:notatId/ferdigstilling`,
    async ({ request, params }) => {
      const payload = await request.json()

      await notatStore.ferdigstillNotat(params.notatId, payload)
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

  http.post<NotatParams>(`/api/sak/:sakId/notater/:notatId/feilregistrering`, async ({ params }) => {
    await notatStore.slettNotat(params.notatId)
    await delay(500)
    return respondNoContent()
  }),

  http.put<NotatParams, NotatUtkast>(`/api/sak/:sakId/notater/:notatId`, async ({ request, params }) => {
    const { type, tittel, tekst, klassifisering } = await request.json()
    await notatStore.oppdaterUtkast(params.sakId, params.notatId, { type, tittel, tekst, klassifisering })
    await delay(500)
    return respondNoContent()
  }),

  http.get<SakParams>(`/api/sak/:sakId/notater`, async ({ params }) => {
    const notater = await notatStore.hentNotater(params.sakId)
    await delay(500)
    return HttpResponse.json({ notater: notater, totalElements: notater.length })
  }),

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

  http.get<NotatParams>(`/api/sak/:sakId/notater/:notatId`, async () => {
    const buffer = await lastDokument('journalført_notat')
    await delay(500)
    return respondPdf(buffer)
  }),
]

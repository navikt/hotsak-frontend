import { http } from 'msw'

import { Brevtype, OppgaveStatusType } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { delay, respondNoContent, respondPdf } from './response'
import type { SakParams } from './params'
import { lastDokumentBarnebriller } from '../data/felles'

interface BrevParams extends SakParams {
  brevtype: string
}

export const brevHandlers: StoreHandlersFactory = ({ sakStore }) => [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  http.get<BrevParams>(`/api/sak/:sakId/brev/:brevtype`, async ({ params }) => {
    let buffer: ArrayBuffer
    if (params.brevtype === Brevtype.BARNEBRILLER_VEDTAK) {
      buffer = await lastDokumentBarnebriller('innvilgelsesbrev')
    } else {
      buffer = await lastDokumentBarnebriller('innhente_opplysninger')
    }
    await delay(1000)
    return respondPdf(buffer)
  }),

  http.post<SakParams>('/api/sak/:sakId/brevsending', async ({ params }) => {
    const { sakId } = params
    await sakStore.lagreSaksdokument(sakId, 'Innhent opplysninger')
    await sakStore.oppdaterStatus(sakId, OppgaveStatusType.AVVENTER_DOKUMENTASJON)
    await sakStore.fjernBrevtekst(sakId)
    await delay(500)
    return respondNoContent()
  }),
]

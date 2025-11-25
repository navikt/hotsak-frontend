import { http } from 'msw'

import { Brevtype, OppgaveStatusType } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { delay, respondNoContent, respondPdf } from './response'
import type { SakParams } from './params'
import { lastDokument, lastDokumentBarnebriller } from '../data/felles'

interface BrevParams extends SakParams {
  brevtype: string
}

export const brevHandlers: StoreHandlersFactory = ({ sakStore }) => [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  http.get<BrevParams>(`/api/sak/:sakId/brev/:brevtype`, async ({ params }) => {
    let buffer: ArrayBuffer
    if (params.brevtype === Brevtype.BARNEBRILLER_VEDTAK) {
      buffer = await lastDokumentBarnebriller('innvilgelsesbrev')
    } else if (params.brevtype === Brevtype.BREVEDITOR_VEDTAKSBREV) {
      const brevTekst = await sakStore.hentBrevtekst(params.sakId)
      if (
        brevTekst?.data?.value &&
        brevTekst?.data?.value[0]?.children &&
        brevTekst?.data?.value[0]?.children[0]?.text == 'Du får ikke låne hjelpemidler'
      ) {
        buffer = await lastDokument('breveditor_vedtaksbrev_avslaatt')
      } else if (
        brevTekst?.data?.value &&
        brevTekst?.data?.value[0]?.children &&
        brevTekst?.data?.value[0]?.children[0]?.text == 'Du får låne noen av hjelpemidlene du har søkt om'
      ) {
        buffer = await lastDokument('breveditor_vedtaksbrev_delvis_innvilget')
      } else {
        buffer = await lastDokument('breveditor_vedtaksbrev')
      }
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

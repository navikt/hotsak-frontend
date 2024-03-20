import { delay, http } from 'msw'

import { Brevtype } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import innvilgelsesbrev from '../data/innvilgelsesBrev.pdf'
import manglerDokumentasjonBrev from '../data/merinfobrev.pdf'
import { respondPdf } from './response'
import type { SakParams } from './params'

interface BrevParams extends SakParams {
  brevtype: string
}

export const brevHandlers: StoreHandlersFactory = () => [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  http.get<BrevParams>(`/api/sak/:sakId/brev/:brevtype`, async ({ params }) => {
    let buffer: ArrayBuffer
    if (params.brevtype === Brevtype.BARNEBRILLER_VEDTAK) {
      buffer = await fetch(innvilgelsesbrev).then((res) => res.arrayBuffer())
    } else {
      buffer = await fetch(manglerDokumentasjonBrev).then((res) => res.arrayBuffer())
    }
    await delay(1000)
    return respondPdf(buffer)
  }),
]

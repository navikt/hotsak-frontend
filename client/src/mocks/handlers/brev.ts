import { rest } from 'msw'

import { Brevtype } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import innvilgetBrev from '../data/innvilgelsesBrev.pdf'
import manglerDokumentasjonBrev from '../data/merinfobrev.pdf'

export const brevHandlers: StoreHandlersFactory = () => [
  // dokumenter for saksbehandlers enhet hvor status != endelig journalført
  rest.get(`/api/sak/:sakId/brev/:brevtype`, async (req, res, ctx) => {
    const brevtype = req.params.brevtype

    let dokumentData
    if (brevtype === Brevtype.BARNEBRILLER_VEDTAK) {
      dokumentData = await fetch(innvilgetBrev).then((res) => res.arrayBuffer())
    } else {
      dokumentData = await fetch(manglerDokumentasjonBrev).then((res) => res.arrayBuffer())
    }

    return res(
      ctx.delay(1000),
      ctx.set('Content-Length', dokumentData.byteLength.toString()),
      ctx.set('Content-Type', 'application/pdf'),
      ctx.body(dokumentData)
    )
  }),
]

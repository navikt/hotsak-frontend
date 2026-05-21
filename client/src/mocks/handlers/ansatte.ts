import { http, HttpResponse } from 'msw'

import type { InnloggetAnsatt } from '../../tilgang/Ansatt.ts'
import type { UtvidetAnsatt } from '../../tilgang/useAnsatt.ts'
import type { StoreHandlersFactory } from '../data'
import { Saksbehandlere } from '../data/Saksbehandlere.ts'
import { delay, respondNoContent, respondUnauthorized } from './response.ts'

export const ansatteHandlers: StoreHandlersFactory = () => [
  http.get<never, never, InnloggetAnsatt>('/api/ansatte/meg', async () => {
    await delay(75)
    const innloggetSaksbehandler = Saksbehandlere.innlogget()
    if (TEST_401) {
      return respondUnauthorized()
    } else {
      return HttpResponse.json(innloggetSaksbehandler)
    }
  }),
  http.get<{ navIdent: string }, never, UtvidetAnsatt>('/api/ansatte/:navIdent', async ({ params }) => {
    await delay(75)
    const { navIdent } = params
    const ansatt = Saksbehandlere.hent(navIdent)
    const [fornavn, etternavn] = ansatt.navn.split(' ')
    return HttpResponse.json({
      navIdent: ansatt.id,
      fornavn,
      etternavn,
      epost: ansatt.epost,
      enhet: ansatt.gjeldendeEnhet,
    })
  }),
  http.post<never, { valgtEnhetsnummer: string }>('/api/ansatte/enhet', async ({ request }) => {
    const { valgtEnhetsnummer } = await request.json()
    Saksbehandlere.setValgtEnhet(valgtEnhetsnummer)
    return respondNoContent()
  }),
]

const TEST_401 = false

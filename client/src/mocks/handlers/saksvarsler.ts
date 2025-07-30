import { http, HttpResponse } from 'msw'

import { Sakstype } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import type { SakParams } from './params'
import { respondNotFound } from './response'

export const saksvarslerHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.get<SakParams>(`/api/sak/:sakId/varsler`, async ({ params }) => {
    const { sakId } = params

    const sak = await sakStore.hent(sakId)
    if (!sak) {
      return respondNotFound()
    }

    if (sak.sakstype === Sakstype.BESTILLING) {
      // Foreløpig hardkodet varsler her og ikke lagt det i en egen store ennå.

      // Midlertidig kommentert ut varsler da det ikke er aktuelt å skru på enda. Hvis det er behov for å teste noe
      // med varsler kan disse kommenteres inn igjen. Ikke fjern ennå.

      return HttpResponse.json([
        /*
        {
          tittel: 'Du må fullføre bestillingen i OeBS. Følgende må gjøres:',
          varslerFor: ['ANNEN_ADRESSE', 'TILBAKELEVERING', 'ALLEREDE_UTLEVERT'],
          beskrivelse: [
            // 'Det er levering til en annen leveringsadresse. Denne må registreres.',
            'Det er en beskjed til kommunen. Du må sjekke at beskjeden ikke inneholder personopplysninger eller annen sensitiv informasjon, og legge den inn på ordren i OeBS.',
            'Et eller flere hjelpemidler er allerede utlevert. Må kanskje registreres på brukes i OeBS, men ikke skipes?',
            'Det er et hjelpemiddel som skal leveres tilbake.',
          ],
        },
        */
      ])
    } else {
      return HttpResponse.json([])
    }
  }),
]

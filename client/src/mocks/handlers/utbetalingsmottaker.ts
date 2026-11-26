import { http, HttpResponse } from 'msw'

import type { KontonummerRequest, KontonummerResponse } from '../../types/types.internal'
import type { StoreHandlersFactory } from '../data'
import { lagTilfeldigNavn } from '../data/navn'
import { delay, respondInternalServerError } from './response'

// Mottakere i mock-behovsmeldingene tilskudd_mottaker_mangler_kontonummer.json og tilskudd_feil_ved_kontonummer.json
const fnrUtenKontonummer = ['404', '03826299412']
const fnrMedFeil = ['500', '17856098135']

export const utbetalingsmottakerHandlers: StoreHandlersFactory = ({ sakStore }) => [
  http.post<never, KontonummerRequest, KontonummerResponse | any>(`/api/utbetalingsmottaker`, async ({ request }) => {
    const { sakId, fnr } = await request.json()
    await delay(500)
    if (fnrUtenKontonummer.includes(fnr)) {
      return HttpResponse.json({ fnr, navn: lagTilfeldigNavn().fulltNavn })
    }
    if (fnrMedFeil.includes(fnr)) {
      return respondInternalServerError()
    }
    const utbetalingsmottaker = await sakStore.oppdaterUtbetalingsmottaker(sakId, fnr)
    return HttpResponse.json(utbetalingsmottaker)
  }),
]

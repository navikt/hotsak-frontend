#!/usr/bin/env bun

import { sql } from 'bun'

export interface Behovsmelding {
  soknads_id: string
  fnr_bruker: string
  fnr_innsender?: string
  data?: string
  created: string
  updated: string
  kommunenavn?: string
  journalpostid?: string
  oppgaveid?: string
  navn_bruker?: string
  er_digital: string
  soknad_gjelder: string
  data_v2?: Record<string, any>
}

async function finnBehovsmeldinger(limit = 10): Promise<Behovsmelding[]> {
  return sql<Behovsmelding[]>`SELECT *
                              FROM v1_soknad
                              WHERE er_digital
                                AND data_v2 ->> 'type' IN ('BESTILLING', 'SØKNAD')
                              ORDER BY created DESC
                              LIMIT ${limit}`
}

export interface BehovsmeldingCase {
  behovsmeldingId: string
  beskrivelse: string
  behovsmelding: Record<string, any>
  behovsmeldingGjelder: string
  fnrBruker: string
  fnrInnsender: string
  opprettet: string
}

await finnBehovsmeldinger(30)
  .then((behovsmeldinger) => {
    const cases: BehovsmeldingCase[] = behovsmeldinger.map((it) => {
      return {
        behovsmeldingId: it.soknads_id,
        beskrivelse: 'importert',
        behovsmelding: it.data_v2,
        behovsmeldingGjelder: it.soknad_gjelder,
        fnrBruker: it.fnr_bruker,
        fnrInnsender: it.fnr_innsender,
        opprettet: it.created,
      }
    })
    return Promise.all(
      cases.map((it) => {
        return Bun.write(
          `../client/src/mocks/data/behovsmeldinger/${it.behovsmeldingId}.json`,
          JSON.stringify(it, null, 2)
        )
      })
    )
  })
  .catch(console.error)

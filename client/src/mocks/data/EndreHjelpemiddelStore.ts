import Dexie, { Table } from 'dexie'

import { Sakstype } from '../../types/types.internal'
import { SakStore } from './SakStore'
import { EndretHjelpemiddelRequest } from '../../saksbilde/hjelpemidler/endreHjelpemiddel/endreHjelpemiddelTypes'

export interface EndretHjelpemiddelEntitet {
  sakId: string
  endredeHjelpemidler: EndretHjelpemiddelRequest[]
}

export class EndreHjelpemiddelStore extends Dexie {
  private readonly endredeHjelpemidler!: Table<EndretHjelpemiddelEntitet, string>

  constructor(private readonly sakStore: SakStore) {
    super('EndredeHjelpemidlerStore')
    this.version(1).stores({
      endredeHjelpemidler: 'sakId',
    })
  }

  async populer() {
    const saker = await this.sakStore.alle()

    this.endredeHjelpemidler.bulkAdd(
      saker
        .filter((sak) => sak.sakstype === Sakstype.BESTILLING || sak.sakstype === Sakstype.SØKNAD)
        .map((sak) => {
          return { sakId: sak.sakId, endredeHjelpemidler: [] }
        }),
      { allKeys: true }
    )
  }

  async hent(sakId: string) {
    const endringer = await this.endredeHjelpemidler.get(sakId)
    if (!endringer) return
    return endringer
  }

  async endreHjelpemiddel(sakId: string, request: EndretHjelpemiddelRequest) {
    const endringer = await this.hent(sakId)
    if (!endringer) return

    this.transaction('rw', this.endredeHjelpemidler, () => {
      if (endringer.endredeHjelpemidler.find((endretHjelpemiddel) => endretHjelpemiddel.id === request.id)) {
        const endredeHjelpemidler = endringer.endredeHjelpemidler
          // fixme -> Hent originalt hmsArtNr fra behovsmelding og sjekk om det er likt som det det endres til. I så fall kan listen tømmes.
          // Må få på plass behovsmelding store først.
          /*
          .filter((endretHjelpemiddel) => {
            return endretHjelpemiddel.hmsArtNr !== request.hmsArtNr
          })
          */
          .map((endretHjelpemiddel) => {
            if (endretHjelpemiddel.id === request.id) {
              return {
                id: request.id,
                hmsArtNr: request.hmsArtNr,
                begrunnelse: request.begrunnelse,
                begrunnelseFritekst: request.begrunnelseFritekst ? request.begrunnelseFritekst : '',
              }
            }
            return endretHjelpemiddel
          })

        this.endredeHjelpemidler.update(endringer.sakId, { endredeHjelpemidler })
      } else {
        return this.endredeHjelpemidler.update(endringer.sakId, {
          endredeHjelpemidler: [
            ...endringer.endredeHjelpemidler,
            {
              id: request.id,
              hmsArtNr: request.hmsArtNr,
              begrunnelse: request.begrunnelse,
              begrunnelseFritekst: request.begrunnelseFritekst ? request.begrunnelseFritekst : '',
            },
          ],
        })
      }
    })
  }
}

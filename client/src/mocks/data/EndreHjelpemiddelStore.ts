import Dexie, { Table } from 'dexie'

import { type EndreHjelpemiddelRequest } from '../../saksbilde/hjelpemidler/endreHjelpemiddel/endreHjelpemiddelTypes'
import { Sakstype } from '../../types/types.internal'
import { SakStore } from './SakStore'

export interface EndredeHjelpemidlerForSak {
  sakId: string
  endredeHjelpemidler: EndreHjelpemiddelRequest[]
}

export class EndreHjelpemiddelStore extends Dexie {
  private readonly endredeHjelpemidler!: Table<EndredeHjelpemidlerForSak, string>

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
    if (!endringer) return { sakId, endredeHjelpemidler: [] }
    return endringer
  }

  async endreHjelpemiddel(sakId: string, request: EndreHjelpemiddelRequest) {
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

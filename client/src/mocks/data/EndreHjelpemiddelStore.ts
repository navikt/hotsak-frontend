import Dexie, { Table } from 'dexie'

import { Bestilling, EndretHjelpemiddel, Sakstype } from '../../types/types.internal'
import { SakStore } from './SakStore'

export class EndreHjelpemiddelStore extends Dexie {
  private readonly endredeHjelpemidler!: Table<Bestilling, string>

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
        .filter((sak) => sak.sakstype === Sakstype.BESTILLING)
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

  async endreHjelpemiddel(sakId: string, request: EndretHjelpemiddel) {
    const endringer = await this.hent(sakId)

    if (!endringer) return

    this.transaction('rw', this.endredeHjelpemidler, () => {
      if (
        endringer.endredeHjelpemidler.find(
          (endretHjelpemiddel) => endretHjelpemiddel.hjelpemiddelId === request.hjelpemiddelId
        )
      ) {
        const end = endringer.endredeHjelpemidler
          // TODO hent originalt hmsnummer fra behovsmelding og sjekk om det er likt som det endres til. I så fall kan listen tømmes.
          // Må få på plass behovsmelding store først
          /*.filter((endretHjelpemiddel) => {
            return endretHjelpemiddel.hmsArtNr !== request.hmsArtNr})*/
          .map((endretHjelpemiddel) => {
            if (endretHjelpemiddel.hjelpemiddelId === request.hjelpemiddelId) {
              return {
                hjelpemiddelId: request.hjelpemiddelId,
                hmsArtNr: request.hmsArtNr,
                begrunnelse: request.begrunnelse,
                begrunnelseFritekst: request.begrunnelseFritekst ? request.begrunnelseFritekst : '',
              }
            }
            return endretHjelpemiddel
          })

        this.endredeHjelpemidler.update(sakId, { sakId, endredeHjelpemidler: end })
      } else {
        return this.endredeHjelpemidler.update(sakId, {
          sakId,
          endredeHjelpemidler: [
            ...endringer.endredeHjelpemidler,
            {
              hjelpemiddelId: request.hjelpemiddelId,
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

import Dexie, { Table } from 'dexie'

import { Bestilling, EndretHjelpemiddel } from '../../types/types.internal'

export class EndreHjelpemiddelStore extends Dexie {
  private readonly endredeHjelpemidler!: Table<Bestilling, string>

  constructor() {
    super('EndredeHjelpemidlerStore')
    this.version(1).stores({
      endredeHjelpemidler: 'sakId',
    })
  }

  async hent(sakId: string): Promise<Bestilling> {
    const endringer = await this.endredeHjelpemidler.get(sakId)
    if (!endringer) {
      return {
        sakId,
        endredeHjelpemidler: [],
      }
    }
    return endringer
  }

  async endreHjelpemiddel(sakId: string, request: EndretHjelpemiddel) {
    const endringer = await this.hent(sakId)
    if (!endringer) {
      this.transaction('rw', this.endredeHjelpemidler, () => {
        this.endredeHjelpemidler.add({
          sakId,
          endredeHjelpemidler: [
            {
              hjelpemiddelId: request.hjelpemiddelId,
              //hmsArtNr: request.hmsArtNr,
              hmsArtNr: request.hmsArtNr,
              begrunnelse: request.begrunnelse,
            },
          ],
        })
      })
    } else {
      this.transaction('rw', this.endredeHjelpemidler, () => {
        if (
          endringer.endredeHjelpemidler.find(
            (endretHjelpemiddel) => endretHjelpemiddel.hjelpemiddelId === request.hjelpemiddelId
          )
        ) {
          this.endredeHjelpemidler.update(sakId, {
            endredeHjelpemidler: endringer.endredeHjelpemidler.map((endretHjelpemiddel) => {
              if (endretHjelpemiddel.hjelpemiddelId === request.hjelpemiddelId) {
                return {
                  hjelpemiddelId: request.hjelpemiddelId,
                  hmsArtNr: request.hmsArtNr,
                  //endretHmsArtNr: request.endretHmsArtNr,
                  begrunnelse: request.begrunnelse,
                }
              }
              return endretHjelpemiddel
            }),
          })
        } else {
          this.endredeHjelpemidler.update(sakId, {
            endredeHjelpemidler: [
              ...endringer.endredeHjelpemidler,
              {
                hjelpemiddelId: request.hjelpemiddelId,
                hmsArtNr: request.hmsArtNr,
                //endretHmsArtNr: request.endretHmsArtNr,
                begrunnelse: request.begrunnelse,
              },
            ],
          })
        }
      })
    }
  }
}

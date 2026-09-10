import Dexie, { Table } from 'dexie'

import { type PunchetHjelpemiddel } from '../../journalføring/journalføringTypes.ts'

interface PunchedeHjelpemidlerForSak {
  sakId: string
  punchedeHjelpemidler: PunchetHjelpemiddel[]
}

export class PunchedeHjelpemidlerStore extends Dexie {
  private readonly punchedeHjelpemidler!: Table<PunchedeHjelpemidlerForSak, string>

  constructor() {
    super('PunchedeHjelpemidlerStore')
    this.version(1).stores({
      punchedeHjelpemidler: 'sakId',
    })
  }

  async lagre(sakId: string, hjelpemidler: PunchetHjelpemiddel[]) {
    if (hjelpemidler.length === 0) {
      return
    }
    await this.punchedeHjelpemidler.put({ sakId, punchedeHjelpemidler: hjelpemidler })
  }

  async hent(sakId: string): Promise<PunchetHjelpemiddel[]> {
    const lagret = await this.punchedeHjelpemidler.get(sakId)
    return lagret?.punchedeHjelpemidler ?? []
  }
}

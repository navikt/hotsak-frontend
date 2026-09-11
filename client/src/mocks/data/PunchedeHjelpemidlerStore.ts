import Dexie, { Table } from 'dexie'

import { type LagretPunchetHjelpemiddel, type PunchetHjelpemiddel } from '../../journalføring/journalføringTypes.ts'

interface PunchedeHjelpemidlerForSak {
  sakId: string
  hjelpemidler: LagretPunchetHjelpemiddel[]
}

interface LegacyPunchedeHjelpemidlerForSak {
  sakId: string
  punchedeHjelpemidler: PunchetHjelpemiddel[]
}

export class PunchedeHjelpemidlerStore extends Dexie {
  private readonly punchedeHjelpemidler!: Table<PunchedeHjelpemidlerForSak | LegacyPunchedeHjelpemidlerForSak, string>

  constructor() {
    super('PunchedeHjelpemidlerStore')
    this.version(1).stores({
      punchedeHjelpemidler: 'sakId',
    })
    this.version(2).stores({
      punchedeHjelpemidler: 'sakId',
    })
  }

  async lagre(sakId: string, hjelpemidler: PunchetHjelpemiddel[]) {
    await this.punchedeHjelpemidler.put({
      sakId,
      hjelpemidler: hjelpemidler.map((hjelpemiddel) => ({
        ...hjelpemiddel,
        id: crypto.randomUUID(),
      })),
    })
  }

  async finnes(sakId: string): Promise<boolean> {
    return (await this.punchedeHjelpemidler.get(sakId)) !== undefined
  }

  async hent(sakId: string): Promise<LagretPunchetHjelpemiddel[]> {
    return (await this.hentSak(sakId))?.hjelpemidler ?? []
  }

  async opprett(sakId: string, hjelpemiddel: PunchetHjelpemiddel): Promise<LagretPunchetHjelpemiddel> {
    const lagret = await this.hentSak(sakId)
    const nyttHjelpemiddel = { ...hjelpemiddel, id: crypto.randomUUID() }
    await this.punchedeHjelpemidler.put({
      sakId,
      hjelpemidler: [...(lagret?.hjelpemidler ?? []), nyttHjelpemiddel],
    })
    return nyttHjelpemiddel
  }

  async oppdater(
    sakId: string,
    hjelpemiddel: LagretPunchetHjelpemiddel
  ): Promise<LagretPunchetHjelpemiddel | undefined> {
    const lagret = await this.hentSak(sakId)
    const eksisterende = lagret?.hjelpemidler.find((it) => it.id === hjelpemiddel.id)
    if (!lagret || !eksisterende) {
      return undefined
    }

    const oppdaterteHjelpemidler = lagret.hjelpemidler.map((it) => (it.id === hjelpemiddel.id ? hjelpemiddel : it))
    await this.punchedeHjelpemidler.put({ sakId, hjelpemidler: oppdaterteHjelpemidler })
    return hjelpemiddel
  }

  async slett(sakId: string, hjelpemiddelId: string): Promise<boolean> {
    const lagret = await this.hentSak(sakId)
    if (!lagret?.hjelpemidler.some((it) => it.id === hjelpemiddelId)) {
      return false
    }

    await this.punchedeHjelpemidler.put({
      sakId,
      hjelpemidler: lagret.hjelpemidler.filter((it) => it.id !== hjelpemiddelId),
    })
    return true
  }

  private async hentSak(sakId: string): Promise<PunchedeHjelpemidlerForSak | undefined> {
    const lagret = await this.punchedeHjelpemidler.get(sakId)
    if (!lagret) {
      return undefined
    }

    const eksisterendeHjelpemidler =
      'punchedeHjelpemidler' in lagret ? lagret.punchedeHjelpemidler : lagret.hjelpemidler
    const legacy = 'punchedeHjelpemidler' in lagret
    const hjelpemidler = eksisterendeHjelpemidler.map((hjelpemiddel) => ({
      ...hjelpemiddel,
      id: hjelpemiddelId(hjelpemiddel),
    }))
    if (
      legacy ||
      hjelpemidler.some(
        (hjelpemiddel, index) => hjelpemiddel.id !== (eksisterendeHjelpemidler[index] as LagretPunchetHjelpemiddel).id
      )
    ) {
      const oppdatert = { sakId, hjelpemidler }
      await this.punchedeHjelpemidler.put(oppdatert)
      return oppdatert
    }
    return { sakId, hjelpemidler }
  }
}

function hjelpemiddelId(hjelpemiddel: Partial<LagretPunchetHjelpemiddel>): string {
  return hjelpemiddel.id ?? crypto.randomUUID()
}

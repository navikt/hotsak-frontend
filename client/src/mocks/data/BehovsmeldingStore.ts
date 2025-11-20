import { type Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { type LagretSak } from './lagSak.ts'

export interface BehovsmeldingCase {
  behovsmeldingId: string
  beskrivelse: string
  behovsmelding: Innsenderbehovsmelding
  behovsmeldingGjelder: string
  fnrBruker: string
  fnrInnsender: string
  opprettet: string
  sakId: string
}

export class BehovsmeldingStore {
  alle: Record<string, () => Promise<BehovsmeldingCase>> = import.meta.glob<BehovsmeldingCase>(
    './behovsmeldinger/**/*.json',
    { eager: false, import: 'default' }
  )

  async hentForPath(path: string): Promise<BehovsmeldingCase | undefined> {
    if (path in this.alle) {
      const loader = this.alle[path]
      return await loader()
    }
  }

  async hentForSak(sak: LagretSak): Promise<BehovsmeldingCase | undefined> {
    return this.hentForPath((sak as any).behovsmeldingCasePath)
  }
}

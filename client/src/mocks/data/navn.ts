import type { Personnavn } from '../../types/hotlibs.ts'
import { tilfeldigInnslag } from './felles'

const fornavn = [
  'Elskverdig',
  'Farlig',
  'Freidig',
  'Frekk',
  'Fremmed',
  'Frodig',
  'Fyldig',
  'Grønn',
  'Gul',
  'Hemmelig',
  'Kald',
  'Klar',
  'Kraftig',
  'Lat',
  'Prangende',
  'Saftig',
  'Sjenert',
  'Smekker',
  'Smidig',
  'Stolt',
  'Syrlig',
  'Vakker',
  'Varm',
  'Voldsom',
  'Yndig',
]

const etternavn = [
  'Bakgård',
  'Bod',
  'Dal',
  'Drill',
  'Eng',
  'Eple',
  'Ert',
  'Fjas',
  'Fjell',
  'Fjon',
  'Hammer',
  'Hane',
  'Jungel',
  'Kjegle',
  'Løvetann',
  'Rose',
  'Sag',
  'Seng',
  'Skap',
  'Slegge',
  'Stue',
  'Sykkel',
  'Tulipan',
  'Tuppe',
  'Vulkan',
]

export function lagTilfeldigNavn(): Personnavn & { fulltNavn: string } {
  const navn: Personnavn = {
    fornavn: tilfeldigInnslag(fornavn),
    etternavn: tilfeldigInnslag(etternavn),
  }
  return {
    ...navn,
    fulltNavn: `${navn.fornavn} ${navn.etternavn}`,
  }
}

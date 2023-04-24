import type { Navn } from '../../types/types.internal'
import { tilfeldigInnslag } from './felles'

const fornavn = [
  'Elskverdig',
  'Farlig',
  'Frekk',
  'Fremmed',
  'Grønn',
  'Gul',
  'Hemmelig',
  'Kald',
  'Klar',
  'Kraftig',
  'Prangende',
  'Saftig',
  'Sjenert',
  'Smidig',
  'Stolt',
  'Syrlig',
  'Vakker',
  'Varm',
  'Voldsom',
  'Yndig',
  'Smekker',
  'Lat',
  'Fyldig',
  'Frodig',
  'Freidig',
]

const etternavn = [
  'Ert',
  'Sag',
  'Eple',
  'Eng',
  'Dal',
  'Jungel',
  'Vulkan',
  'Kjegle',
  'Hane',
  'Tuppe',
  'Hammer',
  'Drill',
  'Slegge',
  'Skap',
  'Seng',
  'Bod',
  'Stue',
  'Fjell',
  'Fjas',
  'Fjon',
  'Tulipan',
  'Rose',
  'Løvetann',
  'Sykkel',
  'Bakgård',
]

export function lagTilfeldigNavn(): Navn & { fulltNavn: string } {
  const navn: Navn = {
    fornavn: tilfeldigInnslag(fornavn),
    etternavn: tilfeldigInnslag(etternavn),
  }
  return {
    ...navn,
    fulltNavn: `${navn.fornavn} ${navn.etternavn}`,
  }
}

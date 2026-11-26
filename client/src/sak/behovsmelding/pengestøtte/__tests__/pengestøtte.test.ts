import { describe, expect, it } from 'vitest'

import vergecase from '../../../../mocks/data/behovsmeldinger/tilskudd_mottaker_mangler_kontonummer.json'
import personencase from '../../../../mocks/data/behovsmeldinger/behovsmelding_tilskudd_rimelige_hjelpemidler.json'
import hjelpemiddelcase from '../../../../mocks/data/behovsmeldinger/behovsmelding_1.json'
import { type Innsenderbehovsmelding } from '../../../../types/BehovsmeldingTypes.ts'
import { utledPengestøtte } from '../pengestøtte.ts'

describe('utledPengestøtte', () => {
  it('bruker personen som mottaker når mottakerfeltene mangler', () => {
    const pengestøtte = utledPengestøtte(personencase.behovsmelding as unknown as Innsenderbehovsmelding)

    expect(pengestøtte).toEqual({
      kategorinavn: 'Tilskudd til rimelige hjelpemidler',
      utbetalesTil: 'Personen jeg søker på vegne av',
      mottaker: { navn: 'Berømt Aktivitet', fnr: '26848497710' },
    })
  })

  it('bruker mottakerfeltene når tilskuddet utbetales til verge', () => {
    const pengestøtte = utledPengestøtte(vergecase.behovsmelding as unknown as Innsenderbehovsmelding)

    expect(pengestøtte?.utbetalesTil).toBe('Verge')
    expect(pengestøtte?.mottaker).toEqual({ navn: 'Vilde Verge', fnr: '03826299412' })
  })

  it('gir undefined når behovsmeldingen ikke gjelder tilskudd', () => {
    expect(utledPengestøtte(hjelpemiddelcase.behovsmelding as unknown as Innsenderbehovsmelding)).toBeUndefined()
  })
})

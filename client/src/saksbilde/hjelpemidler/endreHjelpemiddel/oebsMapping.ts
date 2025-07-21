import { useMemo } from 'react'

import type { AlternativeProduct, AlternativeProdukterByHmsArtNr } from '../useAlternativeProdukter.ts'
import { useTilgangContext } from '../../../tilgang/useTilgang.ts'

interface OebsEnhet {
  readonly navn: string
  readonly lagerlokasjoner: ReadonlyArray<{
    readonly oebsEnhetsnummer: string
    readonly lokasjon: string
  }>
}

const oebsEnheter: Readonly<Record<string, OebsEnhet>> = {
  '2970': { navn: 'IT-avdelingen', lagerlokasjoner: [{ oebsEnhetsnummer: '03', lokasjon: 'Oslo' }] },
  '4701': {
    navn: 'Nav hjelpemiddelsentral Øst-Viken',
    lagerlokasjoner: [{ oebsEnhetsnummer: '01', lokasjon: 'Østfold' }],
  },
  '4702': {
    navn: 'Nav hjelpemiddelsentral Akershus',
    lagerlokasjoner: [{ oebsEnhetsnummer: '03', lokasjon: 'Oslo' }],
  },
  '4703': { navn: 'Nav hjelpemiddelsentral Oslo', lagerlokasjoner: [{ oebsEnhetsnummer: '03', lokasjon: 'Oslo' }] },
  '4704': {
    navn: 'Nav hjelpemiddelsentral Innlandet-Elverum',
    lagerlokasjoner: [{ oebsEnhetsnummer: '04', lokasjon: 'Hedmark' }],
  },
  '4705': {
    navn: 'Nav hjelpemiddelsentral Innlandet-Gjøvik',
    lagerlokasjoner: [{ oebsEnhetsnummer: '05', lokasjon: 'Oppland' }],
  },
  '4706': {
    navn: 'Nav hjelpemiddelsentral Vest-Viken',
    lagerlokasjoner: [{ oebsEnhetsnummer: '06', lokasjon: 'Buskerud' }],
  },
  '4707': {
    navn: 'Nav hjelpemiddelsentral Vestfold og Telemark',
    lagerlokasjoner: [
      { oebsEnhetsnummer: '07', lokasjon: 'Vestfold' },
      { oebsEnhetsnummer: '08', lokasjon: 'Telemark' },
    ],
  },
  '4710': {
    navn: 'Nav hjelpemiddelsentral Agder',
    lagerlokasjoner: [
      { oebsEnhetsnummer: '09', lokasjon: 'Aust-Agder' },
      { oebsEnhetsnummer: '10', lokasjon: 'Vest-Agder' },
    ],
  },
  '4711': {
    navn: 'Nav hjelpemiddelsentral Rogaland',
    lagerlokasjoner: [{ oebsEnhetsnummer: '11', lokasjon: 'Rogaland' }],
  },
  '4712': {
    navn: 'Nav hjelpemiddelsentral Vestland-Bergen',
    lagerlokasjoner: [{ oebsEnhetsnummer: '12', lokasjon: 'Hordaland' }],
  },
  '4714': {
    navn: 'Nav hjelpemiddelsentral Vestland-Førde',
    lagerlokasjoner: [{ oebsEnhetsnummer: '14', lokasjon: 'Sogn og Fjordane' }],
  },
  '4715': {
    navn: 'Nav hjelpemiddelsentral Møre og Romsdal',
    lagerlokasjoner: [{ oebsEnhetsnummer: '15', lokasjon: 'Møre og Romsdal' }],
  },
  '4716': {
    navn: 'Nav hjelpemiddelsentral Trøndelag',
    lagerlokasjoner: [
      { oebsEnhetsnummer: '16', lokasjon: 'Sør-Trøndelag' },
      { oebsEnhetsnummer: '17', lokasjon: 'Nord-Trøndelag' },
    ],
  },
  '4718': {
    navn: 'Nav hjelpemiddelsentral Nordland',
    lagerlokasjoner: [{ oebsEnhetsnummer: '18', lokasjon: 'Nordland' }],
  },
  '4719': {
    navn: 'Nav hjelpemiddelsentral Troms og Finnmark',
    lagerlokasjoner: [
      { oebsEnhetsnummer: '19', lokasjon: 'Troms' },
      { oebsEnhetsnummer: '20', lokasjon: 'Finnmark' },
    ],
  },
}

type WareHouseStock = NonNullable<AlternativeProduct['wareHouseStock']>

export function finnGjeldendeOebsEnhet(enhetsnummer: string) {
  const oebsEnhet = oebsEnheter[enhetsnummer]
  const lagerlokasjoner = oebsEnhet?.lagerlokasjoner?.map((lokasjon) => lokasjon.lokasjon.toLowerCase()) || []

  const lagerstatusForEnhet = (produkt: AlternativeProduct): WareHouseStock =>
    produkt.wareHouseStock?.filter(
      (lagerstatus) => lagerstatus?.location && lagerlokasjoner.includes(lagerstatus.location.toLocaleLowerCase())
    ) ?? []

  return {
    oebsEnhet,
    lagerlokasjoner,
    /**
     * Grupper på hmsArtNr og inkluder kun lagerstatus for gjeldende OeBS-enhet.
     *
     * @param produkter
     */
    grupperPåHmsArtNr(produkter: AlternativeProduct[]): AlternativeProdukterByHmsArtNr {
      return produkter.reduce<AlternativeProdukterByHmsArtNr>((result, produkt) => {
        const filtrertProdukt: AlternativeProduct = {
          ...produkt,
          wareHouseStock: lagerstatusForEnhet(produkt),
        }

        produkt.alternativeFor.forEach((hmsArtNr) => {
          if (!result[hmsArtNr]) {
            result[hmsArtNr] = []
          }
          result[hmsArtNr].push(filtrertProdukt)
        })
        return result
      }, {})
    },
    /**
     * Undersøk om den gjeldende OeBS-enheten har produktet på lager.
     *
     * @param produkt
     */
    harProduktPåLager(produkt: AlternativeProduct): boolean {
      const påLager = lagerstatusForEnhet(produkt).filter(
        (lagerstatus) => lagerstatus?.amountInStock && lagerstatus.amountInStock > 0
      )
      return påLager.length > 0
    },
  }
}

export function useGjeldendeOebsEnhet() {
  const { innloggetAnsatt } = useTilgangContext()
  const gjeldendeEnhetsnummer = innloggetAnsatt.gjeldendeEnhet.nummer
  return useMemo(() => finnGjeldendeOebsEnhet(gjeldendeEnhetsnummer), [gjeldendeEnhetsnummer])
}

interface Lagerlokasjon {
  oebs_enhetsnummer: string
  lokasjon: string
}

interface OebsEnhet {
  enhetsnummer: string
  navn: string
  lagerlokasjoner: Lagerlokasjon[]
}

export const oebs_enheter: OebsEnhet[] = [
  { enhetsnummer: '2970', navn: 'IT-avdelingen', lagerlokasjoner: [{ oebs_enhetsnummer: '03', lokasjon: 'Oslo' }] },
  {
    enhetsnummer: '4701',
    navn: 'Nav hjelpemiddelsentral Øst-Viken',
    lagerlokasjoner: [{ oebs_enhetsnummer: '01', lokasjon: 'Østfold' }],
  },
  {
    enhetsnummer: '4702',
    navn: 'Nav hjelpemiddelsentral Akershus',
    lagerlokasjoner: [{ oebs_enhetsnummer: '03', lokasjon: 'Oslo' }],
  },
  {
    enhetsnummer: '4703',
    navn: 'Nav hjelpemiddelsentral Oslo',
    lagerlokasjoner: [{ oebs_enhetsnummer: '03', lokasjon: 'Oslo' }],
  },
  {
    enhetsnummer: '4704',
    navn: 'Nav hjelpemiddelsentral Innlandet-Elverum',
    lagerlokasjoner: [{ oebs_enhetsnummer: '04', lokasjon: 'Hedmark' }],
  },
  {
    enhetsnummer: '4705',
    navn: 'Nav hjelpemiddelsentral Innlandet-Gjøvik',
    lagerlokasjoner: [{ oebs_enhetsnummer: '05', lokasjon: 'Oppland' }],
  },
  {
    enhetsnummer: '4706',
    navn: 'Nav hjelpemiddelsentral Vest-Viken',
    lagerlokasjoner: [{ oebs_enhetsnummer: '06', lokasjon: 'Buskerud' }],
  },
  {
    enhetsnummer: '4707',
    navn: 'Nav hjelpemiddelsentral Vestfold og Telemark',
    lagerlokasjoner: [
      { oebs_enhetsnummer: '07', lokasjon: 'Vestfold' },
      { oebs_enhetsnummer: '08', lokasjon: 'Telemark' },
    ],
  },
  {
    enhetsnummer: '4710',
    navn: 'Nav hjelpemiddelsentral Agder',
    lagerlokasjoner: [
      { oebs_enhetsnummer: '09', lokasjon: 'Aust-Agder' },
      { oebs_enhetsnummer: '10', lokasjon: 'Vest-Agder' },
    ],
  },
  {
    enhetsnummer: '4711',
    navn: 'Nav hjelpemiddelsentral Rogaland',
    lagerlokasjoner: [{ oebs_enhetsnummer: '11', lokasjon: 'Rogaland' }],
  },
  {
    enhetsnummer: '4712',
    navn: 'Nav hjelpemiddelsentral Vestland-Bergen',
    lagerlokasjoner: [{ oebs_enhetsnummer: '12', lokasjon: 'Hordaland' }],
  },
  {
    enhetsnummer: '4714',
    navn: 'Nav hjelpemiddelsentral Vestland-Førde',
    lagerlokasjoner: [{ oebs_enhetsnummer: '14', lokasjon: 'Sogn og Fjordane' }],
  },
  {
    enhetsnummer: '4715',
    navn: 'Nav hjelpemiddelsentral Møre og Romsdal',
    lagerlokasjoner: [{ oebs_enhetsnummer: '15', lokasjon: 'Møre og Romsdal' }],
  },
  {
    enhetsnummer: '4716',
    navn: 'Nav hjelpemiddelsentral Trøndelag',
    lagerlokasjoner: [
      { oebs_enhetsnummer: '16', lokasjon: 'Sør-Trøndelag' },
      { oebs_enhetsnummer: '17', lokasjon: 'Nord-Trøndelag' },
    ],
  },
  {
    enhetsnummer: '4718',
    navn: 'Nav hjelpemiddelsentral Nordland',
    lagerlokasjoner: [{ oebs_enhetsnummer: '18', lokasjon: 'Nordland' }],
  },
  {
    enhetsnummer: '4719',
    navn: 'Nav hjelpemiddelsentral Troms og Finnmark',
    lagerlokasjoner: [
      { oebs_enhetsnummer: '19', lokasjon: 'Troms' },
      { oebs_enhetsnummer: '20', lokasjon: 'Finnmark' },
    ],
  },
]

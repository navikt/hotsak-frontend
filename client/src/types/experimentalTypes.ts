import { Enhet, Navn, Oppgavestatus, Oppgavetype, Saksbehandler } from './types.internal'

export interface OppgaveApiOppgave {
  oppgaveId: string
  oppgavetype: Oppgavetype
  oppgavestatus: Oppgavestatus
  tema: string
  behandlingstema?: string | null
  behandlingstype?: string | null
  gjelder?: string | null
  beskrivelse?: string
  prioritet: OppgavePrioritet
  tildeltEnhet: Enhet
  tildeltSaksbehandler?: Saksbehandler
  opprettetAv?: string
  opprettetAvEnhet?: Enhet
  endretAv?: string
  endretAvEnhet?: Enhet
  aktivDato: string
  journalpostId?: string
  behandlesAvApplikasjon?: string
  mappeId?: string
  fristFerdigstillelse?: string
  opprettetTidspunkt?: string
  endretTidspunkt?: string
  ferdigstiltTidspunkt?: string
  fnr?: string
  sakId?: string
  bruker?: OppgaveApiOppgaveBruker
  versjon: number
}

export interface OppgaveApiOppgaveBruker {
  fnr: string
  navn?: Navn
}

export enum OppgavePrioritet {
  HØY = 'HØY',
  NORMAL = 'NORMAL',
  LAV = 'LAV',
}

export interface OppgaveApiResponse {
  oppgaver: OppgaveApiOppgave[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalElements: number
}

export enum OppgaveGjelderFilter {
  ALLE = 'ALLE',
  BESTILLING = 'BESTILLING',
  DIGITAL_SØKNAD = 'DIGITAL_SØKNAD',
  HASTESØKNAD = 'HASTESØKNAD',
}

export const OppgavetemaLabel = new Map<string, string>([
  [OppgaveGjelderFilter.ALLE, 'Alle'],
  [OppgaveGjelderFilter.BESTILLING, 'Bestilling'],
  [OppgaveGjelderFilter.DIGITAL_SØKNAD, 'Søknad'],
  [OppgaveGjelderFilter.HASTESØKNAD, 'Hastesøknad'],
])

export enum OppgaverFilter {
  ALLE = 'ALLE',
  UFORDELTE = 'UFORDELTE',
  MINE = 'MINE',
}

export const SakerFilterLabel = new Map<string, string>([
  [OppgaverFilter.ALLE, 'Alle'],
  [OppgaverFilter.MINE, 'Mine saker'],
  [OppgaverFilter.UFORDELTE, 'Ufordelte'],
])
/*

[
  {
    "behandlingstema": "ab0522",
    "behandlingstemaTerm": "Afaki",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0523",
    "behandlingstemaTerm": "Filterbriller",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0464",
    "behandlingstemaTerm": "Kommunikasjon",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0004",
    "behandlingstypeTerm": "Behandle vedtak"
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0034",
    "behandlingstypeTerm": "Søknad"
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0046",
    "behandlingstypeTerm": "Anke"
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0058",
    "behandlingstypeTerm": "Klage"
  },
  {
    "behandlingstema": "ab0241",
    "behandlingstemaTerm": "Hjelpemidler dagliglivet",
    "behandlingstype": "ae0106",
    "behandlingstypeTerm": "Utland"
  },
  {
    "behandlingstema": "ab0243",
    "behandlingstemaTerm": "Høreapparat",
    "behandlingstype": "ae0106",
    "behandlingstypeTerm": "Utland"
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0106",
    "behandlingstypeTerm": "Utland"
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0114",
    "behandlingstypeTerm": "Tidligere hjemsendt sak"
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0115",
    "behandlingstypeTerm": "Hjemsendt til ny behandling"
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0223",
    "behandlingstypeTerm": "Barn"
  },
  {
    "behandlingstema": "ab0046",
    "behandlingstemaTerm": "Førerhund",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0054",
    "behandlingstemaTerm": "Funksjonsassistent",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0210",
    "behandlingstemaTerm": "Tilpasningskurs døve, døvblinde og blinde",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0215",
    "behandlingstemaTerm": "Ombygging /tilrettelegging arbeid",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0240",
    "behandlingstemaTerm": "Hjelpemidler arbeidslivet",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0241",
    "behandlingstemaTerm": "Hjelpemidler dagliglivet",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0242",
    "behandlingstemaTerm": "Grunnmønster",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0243",
    "behandlingstemaTerm": "Høreapparat",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0245",
    "behandlingstemaTerm": "Lese- og sekretærhjelp",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0250",
    "behandlingstemaTerm": "Opplæringstiltak",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0251",
    "behandlingstemaTerm": "Tolkehjelp hørselshemmede",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0252",
    "behandlingstemaTerm": "Tolke- / ledsagerhjelp døvblind",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0253",
    "behandlingstemaTerm": "Tinnitusmaskerer",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0315",
    "behandlingstemaTerm": "Arbeids- og utdanningsreiser",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0317",
    "behandlingstemaTerm": "Briller/linser",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0328",
    "behandlingstemaTerm": "Bidrag ekskl. farskap",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0332",
    "behandlingstemaTerm": "Servicehund",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0353",
    "behandlingstemaTerm": "Arbeid",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0367",
    "behandlingstemaTerm": "Tolk",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0368",
    "behandlingstemaTerm": "Folkehøgskole",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0369",
    "behandlingstemaTerm": "Aktivitetshjelpemidler",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0370",
    "behandlingstemaTerm": "Varsling og alarm",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0371",
    "behandlingstemaTerm": "ERS",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0372",
    "behandlingstemaTerm": "Kognisjon",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0373",
    "behandlingstemaTerm": "IT",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0374",
    "behandlingstemaTerm": "Bolig",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0375",
    "behandlingstemaTerm": "MRS",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0376",
    "behandlingstemaTerm": "Hørsel",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0377",
    "behandlingstemaTerm": "Syn",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0378",
    "behandlingstemaTerm": "Henvisning",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0379",
    "behandlingstemaTerm": "Forflytning",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0380",
    "behandlingstemaTerm": "Bestilling",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0403",
    "behandlingstemaTerm": "Faktura høreapparater",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0224",
    "behandlingstypeTerm": "Partsinnsyn"
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0227",
    "behandlingstypeTerm": "Digital søknad"
  },
  {
    "behandlingstema": "ab0427",
    "behandlingstemaTerm": "Behandlingsbriller/linser ordinære vilkår",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0428",
    "behandlingstemaTerm": "Behandlingsbriller/linser særskilte vilkår",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0429",
    "behandlingstemaTerm": "Irislinser",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0443",
    "behandlingstemaTerm": "Regning lese- og sekretærhjelp",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0445",
    "behandlingstemaTerm": "Høreapparat - dispensasjon",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0520",
    "behandlingstemaTerm": "Hastesøknad",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": "ab0521",
    "behandlingstemaTerm": "Hastebytte",
    "behandlingstype": null,
    "behandlingstypeTerm": null
  },
  {
    "behandlingstema": null,
    "behandlingstemaTerm": null,
    "behandlingstype": "ae0273",
    "behandlingstypeTerm": "Digitalt bytte"
  }
]

*/

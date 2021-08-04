import { Dayjs } from 'dayjs'


export interface Sak {
    saksid: string
    søknadGjelder: string,
    hjelpemidler: Hjelpemiddel[]
    formidler: Formidler
    greitÅViteFaktum: GreitÅViteFaktum[]
    motattDato: string
    personinformasjon: Personinfo
    levering: Levering
    oppfølgingsansvarlig: Oppfølgingsansvarlig
    saksbehandler: Saksbehandler
    status: StatusType
    enhet: Enhet[]
}

export interface Enhet {
    enhetsnummer: string
    enhetsnavn: string
}

export interface Oppfølgingsansvarlig {
    navn: string
    arbeidssted: string
    stilling: string
    telefon: string
    ansvarFor: string
}

export interface Levering {
    kontaktPerson?: KontaktPerson
    leveringsmåte: Leveringsmåte
    adresse?: string
    merknad?: string
}


export enum Leveringsmåte {
    FOLKEREGISTRERT_ADRESSE,
    ANNEN_ADRESSE,
    HJELPEMIDDELSENTRAL,
    ALLEREDE_LEVERT
}

export interface KontaktPerson {
    navn: string,
    adresse: string,
    kontaktpersonType: KontaktPersonType
}

export enum KontaktPersonType {
    HJELPEMIDDELBRUKER = 'hjelpemiddelbruker'
}
export interface Hjelpemiddel {
    hmsnr: string,
    rangering: number
    alleredeUtlevert: boolean
    antall: number
    kategori: string
    beskrivelse: string
    tilleggsinfo: Tilleggsinfo[]
    tilbehør: Tilbehør[]
}

export interface Tilleggsinfo {
    tittel: string
    innhold: string
}

export interface Tilbehør {
    hmsnr: string
    antall: number
    navn: string
}

export interface Formidler {
    navn: string
    poststed: string
    arbeidssted: string
    stilling: string
    postadresse: string
    telefon: string
    treffesEnklest: string
    epost: string
}

export interface GreitÅViteFaktum {
    beskrivelse: string
    type: GreitÅViteType
}

export enum GreitÅViteType {
    ADVARSEL = 'advarsel',
    INFO = 'info'
}

export interface Oppgave {
  opprettetDato: Dayjs
  mottattDato: string
  saksid: string
  personinformasjon: Personinfo
  status: StatusType
  saksbehandler?: Saksbehandler
  søknadOm: string
}

export interface Saksbehandler {
    objectId: string
    epost: string
    navn: string
  }

export enum StatusType {
  MOTTATT = 'mottatt',
  OVERFØRT_GOSYS = 'overført_gosys',
  INNVILGET = 'innvilget',
}

export interface Error {
    message: string
    statusCode?: number
    technical?: string
  }

export enum Kjønn  {
    MANN = 'MANN',
    KVINNE = 'KVINNE',
    UKJENT = 'UKJENT'
}

export interface Personinfo {
  fornavn: string
  mellomnavn: string | null
  etternavn: string
  fødselsdato: string | undefined
  kjønn: Kjønn
  fnr: string
  brukernummer?: string
  adresse: string
  kilde: PersonInfoKilde
  signaturType: SignaturType
  telefon: string
  funksjonsnedsettelse: string[]
  bruksarena: Bruksarena
  bosituasjon: Bosituasjon
  postnummer: string
  poststed: string
  gtNummer: string
  gtType: string
  egenAnsatt: boolean
  brukerErDigital: boolean
  oppfylteVilkår: string[]
  kroppsmål?: Kroppsmål
}

export interface Kroppsmål {
    høyde: number
    kroppsvekt: number
    lårlengde: number
    legglengde: number
    setebredde: number
}

export enum Bruksarena {
    DAGLIGLIV = 'dagligliv'
}

export enum Bosituasjon {
    HJEMME = 'HJEMME',
    INSTITUSJON = 'INSITUSJON'
}

export enum SignaturType {
    SIGNATUR = 'signatur',
    BRUKER_BEKREFTER = 'bruker_bekrefter'
}

export enum PersonInfoKilde {
    PDL = 'pdl',
    MANUELL = 'manuell'
}

export enum Oppgavetype {
    Søknad = 'SØKNAD',
  }

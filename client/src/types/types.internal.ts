import { Dayjs } from 'dayjs'

export interface Sak {
  saksid: string
  søknadGjelder: string
  hjelpemidler: HjelpemiddelType[]
  formidler: Formidler
  greitÅViteFaktum: GreitÅViteFaktum[]
  mottattDato: string
  personinformasjon: Personinfo
  levering: Levering
  oppfølgingsansvarlig: Oppfølgingsansvarlig
  saksbehandler: Saksbehandler
  status: OppgaveStatusType
  vedtak: VedtakType
  enhet: Enhet[]
}

export enum VedtaksgrunnlagType {
  UTLAANSHISTORIKK = 'UTLAANSHISTORIKK',
}

export interface Vedtaksgrunnlag {
  type: VedtaksgrunnlagType
  data: any[] | undefined
}

export const vedtaksgrunnlagUtlaanshistorikk = (utlaanshistorikk: HjelpemiddelArtikkel[]): Vedtaksgrunnlag => {
  return { type: VedtaksgrunnlagType.UTLAANSHISTORIKK, data: utlaanshistorikk }
}

export interface Hendelse {
  id: string
  hendelse: string
  opprettet: string
  bruker?: string
  detaljer?: string
}

export interface HjelpemiddelArtikkel {
  antall: number
  antallEnhet: string
  isoKode: string
  isoKategori: string
  beskrivelse: string
  hmsnr: string
  serieNr?: string
  datoUtsendelse: string
  ordrenummer?: string
  status: string
  grunndataBeriket: boolean
  grunndataProduktNavn?: string
  grunndataBeskrivelse?: string
  grunndataKategori?: string
  grunndataBilde?: string
  grunndataKategoriKortnavn?: string
  hjelpemiddeldatabasenURL?: string
}

export interface VedtakType {
  vedtaksdato: string
  status: VedtakStatusType
  saksbehandlerOid: string
  saksbehandlerNavn: string
  søknadsId: string
  vedtaksgrunnlag?: Vedtaksgrunnlag[]
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
  kontaktperson?: KontaktPerson
  leveringsmåte: Leveringsmåte
  adresse?: string
  merknad?: string
}

export enum Leveringsmåte {
  FOLKEREGISTRERT_ADRESSE = 'FOLKEREGISTRERT_ADRESSE',
  ANNEN_ADRESSE = 'ANNEN_ADRESSE',
  HJELPEMIDDELSENTRAL = 'HJELPEMIDDELSENTRAL',
  ALLEREDE_LEVERT = 'ALLEREDE_LEVERT',
}

export interface KontaktPerson {
  navn: string
  telefon: string
  kontaktpersonType: KontaktPersonType
}

export enum KontaktPersonType {
  HJELPEMIDDELBRUKER = 'HJELPEMIDDELBRUKER',
  HJELPEMIDDELFORMIDLER = 'HJELPEMIDDELFORMIDLER',
  ANNEN_KONTAKTPERSON = 'ANNEN_KONTAKTPERSON',
}
export interface HjelpemiddelType {
  hmsnr: string
  rangering: number
  alleredeUtlevert: boolean
  utlevertInfo: UtlevertInfo
  antall: number
  kategori: string
  beskrivelse: string
  tilleggsinfo: Tilleggsinfo[]
  tilbehør: Tilbehør[]
}

export interface UtlevertInfo {
  annenKommentar: string
  overførtFraBruker: string
  utlevertType: UtlevertType
}

export enum UtlevertType {
  FremskuttLager = 'FremskuttLager',
  Korttidslån = 'Korttidslån',
  Overført = 'Overført',
  Annet = 'Annet',
}

export interface Tilleggsinfo {
  tittel: string
  innholdsliste: string[]
}

export interface Tilbehør {
  hmsNr: string
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
  treffestEnklest: string
  epost: string
}

export interface GreitÅViteFaktum {
  beskrivelse: string
  type: GreitÅViteType
}

export enum GreitÅViteType {
  ADVARSEL = 'ADVARSEL',
  INFO = 'INFO',
  MERKNAD = 'MERKNAD',
}

export interface Oppgave {
  type: Oppgavetype
  opprettetDato: Dayjs
  mottattDato: string
  formidlerNavn: string
  saksid: string
  personinformasjon: PersoninfoOppgave
  status: OppgaveStatusType
  saksbehandler?: Saksbehandler
  søknadOm: string
}

export enum Oppgavetype {
  SØKNAD = 'SØKNAD',
  BESTILLING = 'BESTILLING',
}

export interface Saksbehandler {
  objectId: string
  epost: string
  navn: string
}

export enum OppgaveStatusType {
  AVVENTER_SAKSBEHANDLER = 'AVVENTER_SAKSBEHANDLER',
  TILDELT_SAKSBEHANDLER = 'TILDELT_SAKSBEHANDLER',
  SENDT_GOSYS = 'SENDT_GOSYS',
  VEDTAK_FATTET = 'VEDTAK_FATTET',
  FERDIGSTILT = 'FERDIGSTILT',
  ALLE = 'ALLE',
}

export const OppgaveStatusLabel = new Map<string, string>([
  [OppgaveStatusType.ALLE, 'Alle'],
  [OppgaveStatusType.VEDTAK_FATTET, 'Innvilget'],
  [OppgaveStatusType.AVVENTER_SAKSBEHANDLER, 'Mottatt'],
  [OppgaveStatusType.SENDT_GOSYS, 'Sendt GOSYS'],
  [OppgaveStatusType.TILDELT_SAKSBEHANDLER, 'Under behandling'],
  /*[OppgaveStatusType.FERDIGSTILT, 'Ferdigstilt'],*/ // Brukes ikke enda
])

export enum VedtakStatusType {
  INNVILGET = 'INNVILGET',
}

export const VedtakStatusLabel = new Map<string, string>([[VedtakStatusType.INNVILGET, 'Innvilget']])

export interface Error {
  message: string
  statusCode?: number
  technical?: string
}

export enum Kjønn {
  MANN = 'MANN',
  KVINNE = 'KVINNE',
  UKJENT = 'UKJENT',
}

export interface PersoninfoOppgave {
  fornavn: string
  mellomnavn: string | null
  etternavn: string
  fnr: string
  funksjonsnedsettelse: string[]
  poststed: string
  bosted: string
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
  signaturtype: SignaturType
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
  DAGLIGLIV = 'dagligliv',
}

export enum Bosituasjon {
  HJEMME = 'HJEMME',
  INSTITUSJON = 'INSITUSJON',
}

export enum SignaturType {
  FULLMAKT = 'FULLMAKT',
  BRUKER_BEKREFTER = 'BRUKER_BEKREFTER',
  FRITAK_FRA_FULLMAKT = 'FRITAK_FRA_FULLMAKT',
}

export enum PersonInfoKilde {
  PDL = 'pdl',
  MANUELL = 'manuell',
}

export interface Produkt {
  isokode: string
  isotittel: string
  rammeavtalePostId: string
  produkturl: string
  artikkelurl: string
  posttittel: string
}

export enum Filter {
  SAKER,
  STATUS,
  OMRÅDE,
}

export enum SakerFilter {
  ALLE = 'ALLE',
  UFORDELTE = 'UFORDELTE',
  MINE = 'MINE',
}

export enum OmrådeFilter {
  ALLE = 'ALLE',
  BEVEGELSE = 'BEVEGELSE',
  HØRSEL = 'HØRSEL',
  KOGNISJON = 'KOGNISJON',
}

export const SakerFilterLabel = new Map<string, string>([
  [SakerFilter.ALLE, 'Alle'],
  [SakerFilter.MINE, 'Mine saker'],
  [SakerFilter.UFORDELTE, 'Ufordelte'],
])

export const OmrådeFilterLabel = new Map<string, string>([
  [OmrådeFilter.ALLE, 'Alle'],
  [OmrådeFilter.BEVEGELSE, 'Bevegelse'],
  [OmrådeFilter.HØRSEL, 'Hørsel'],
  [OmrådeFilter.KOGNISJON, 'Kognisjon'],
])

export enum HøyrekolonneTabs {
  SAKSHISTORIKK = 'SAKSHISTORIKK',
  HJELPEMIDDELOVERSIKT = 'HJELPEMIDDELOVERSIKT',
}

export interface OverforGosysTilbakemelding {
  valgteArsaker: string[]
  begrunnelse: string
}

export interface PersonoversiktType {
  fornavn: string
  mellomnavn: string | null
  etternavn: string
  fødselsdato: string | undefined
  kjønn: Kjønn
  fnr: string
  brukernummer?: string
  telefon: string
}

export interface Saksoversikt {
  hotsakSaker: Saksoversikt_Sak[]
}
export interface Saksoversikt_Sak {
  saksid: string
  søknadGjelder: string
  mottattDato: string
  område: string[]
  saksbehandler?: string
  fagsystem: string
  status: OppgaveStatusType
  vedtak?: VedtakType
  enhet: Enhet[]
}

export interface Saksinformasjon {
  opprettet: string
}

export interface HarSaksinformasjon {
  saksinformasjon: Saksinformasjon
  saksbehandler?: Saksbehandler
}

export interface Sak extends HarSaksinformasjon {
  sakId: string
  sakstype: Oppgavetype
  søknadGjelder: string
  hjelpemidler: HjelpemiddelType[]
  formidler: Formidler
  greitÅViteFaktum: GreitÅViteFaktum[]
  mottattDato: string
  personinformasjon: Personinfo
  innsender: Innsender
  bruker: Bruker
  levering: Levering
  oppfølgingsansvarlig: Oppfølgingsansvarlig
  status: OppgaveStatusType
  statusEndret: string
  vedtak?: VedtakType
  enhet: Enhet
}

export interface Barnebrillesak extends HarSaksinformasjon {
  sakId: string
  sakstype: Oppgavetype
  søknadGjelder: string
  innsender: Innsender
  bruker: Bruker
  status: OppgaveStatusType
  statusEndret: string
  steg: StegType
  vilkårsgrunnlag?: Vilkårsgrunnlag
  vilkårsvurdering?: Vilkårsvurdering
  journalposter: string[]
  vedtak?: VedtakType
  enhet: Enhet
  utbetalingsmottaker?: Utbetalingsmottaker
  totrinnskontroll?: Totrinnskontroll
}

export interface Totrinnskontroll {
  saksbehandler: Saksbehandler
  godkjenner?: Saksbehandler
  resultat?: 'GODKJENT' | 'RETURNERT'
  begrunnelse?: string
  opprettet?: string
  godkjent?: string
}

export interface Vilkårsvurdering {
  id: string
  sakId: string
  opprettet: string
  resultat: VilkårsResultat
  sats: SatsType
  satsBeløp: number
  satsBeskrivelse: string
  beløp: string
  vilkår: Vilkår[]
}

export interface Vilkår {
  id: string
  identifikator:
    | 'Under18ÅrPåBestillingsdato v1'
    | 'MedlemAvFolketrygden v1'
    | 'bestiltHosOptiker'
    | 'komplettBrille'
    | 'HarIkkeVedtakIKalenderåret v1'
    | 'Brillestyrke v1'
    | 'BestillingsdatoTilbakeITid v1'
    | 'Bestillingsdato v1'
    | string
  beskrivelse: string
  resultatAuto?: VilkårsResultat
  begrunnelseAuto?: string
  resultatSaksbehandler?: VilkårsResultat
  begrunnelseSaksbehandler?: string
  lovReferanse?: string
  lovdataLenke?: string
  grunnlag: Record<string, string | number>
}

export interface Grunnlag {
  bestillingsdato?: string
  eksisterendeVedtakDato?: string
  barnetsAlder?: string
  datoOrdningenStartet?: string
  seksMånederSiden?: string
}

export interface GrunnlagMetadata {
  etikett: string
  beskrivelse: string
}

export type GrunnlagType = keyof Grunnlag

export enum VilkårsResultat {
  JA = 'JA',
  NEI = 'NEI',
  KANSKJE = 'KANSKJE',
}

export interface RegistrerSøknadData {
  målform: MålformType
  brilleseddel: Brilleseddel
  bestillingsdato: Date
  brillepris: string
  bestiltHosOptiker: ManuellVurdering
  komplettBrille: ManuellVurdering
}

export interface ManuellVurdering {
  vilkårOppfylt: VilkårSvar | ''
  begrunnelse?: string
}

export interface OppdaterVilkårData {
  resultatSaksbehandler: VilkårSvar | ''
  begrunnelseSaksbehandler: string
}

export interface TotrinnskontrollData {
  resultat: TotrinnskontrollVurdering | ''
  begrunnelse?: string
}

export enum TotrinnskontrollVurdering {
  GODKJENT = 'GODKJENT',
  RETURNERT = 'RETURNERT',
}

export interface OppdaterVilkårRequest {
  resultatSaksbehandler: VilkårSvar
  begrunnelseSaksbehandler: string
}

export interface KontonummerRequest {
  fnr: string
  sakId: string
}

export interface KontonummerResponse {
  fnr?: string
  navn?: string
  kontonummer?: string
}

export type Utbetalingsmottaker = KontonummerResponse

export interface VurderVilkårRequest {
  sakId: string
  målform: MålformType
  bestillingsdato: string
  brillepris: string
  brilleseddel: Brilleseddel
  bestiltHosOptiker: ManuellVurdering
  komplettBrille: ManuellVurdering
  saksbehandlersBegrunnelse?: string
}

export interface Vilkårsgrunnlag {
  sakId: string
  målform: MålformType
  bestillingsdato: string
  brillepris: string
  brilleseddel: Brilleseddel
  bestiltHosOptiker: ManuellVurdering
  komplettBrille: ManuellVurdering
  saksbehandlersBegrunnelse?: string
}

export enum VilkårSvar {
  JA = 'JA',
  NEI = 'NEI',
}

export enum MålformType {
  BOKMÅL = 'BOKMÅL',
  NYNORSK = 'NYNORSK',
}

export type Diopter = string | number

export interface Brilleseddel {
  høyreSfære: Diopter
  høyreSylinder: Diopter
  venstreSfære: Diopter
  venstreSylinder: Diopter
}

export enum StegType {
  INNHENTE_FAKTA = 'INNHENTE_FAKTA',
  VURDERE_VILKÅR = 'VURDERE_VILKÅR',
  FATTE_VEDTAK = 'FATTE_VEDTAK',
  GODKJENNE = 'GODKJENNE',
  REVURDERE = 'REVURDERE',
  FERDIG_BEHANDLET = 'FERDIG_BEHANDLET',
}

export interface BeregnSatsResponse {
  sats: SatsType
  satsBeskrivelse: string
  satsBeløp: number
}

export type BeregnSatsRequest = Brilleseddel

export enum SatsType {
  SATS_1 = 'SATS_1',
  SATS_2 = 'SATS_2',
  SATS_3 = 'SATS_3',
  SATS_4 = 'SATS_4',
  SATS_5 = 'SATS_5',
  INGEN = 'INGEN',
}

export interface Navn {
  fornavn: string
  mellomnavn?: string
  etternavn: string
}

export interface Innsender {
  fnr: string
  navn: string
}

export interface Bruker {
  fnr: string
  brukernummer?: string
  navn: Navn
  fødselsdato: string
  kommune: Kommune
  bydel?: Bydel
  kjønn?: Kjønn
  telefon?: string
  kontonummer?: string
}

export interface Kommune {
  nummer: string
  navn: string
}

export interface Bydel {
  nummer: string
  navn: string
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
  id: number
  hmsnr: string
  rangering: number
  alleredeUtlevert: boolean
  utlevertInfo: UtlevertInfo
  antall: number
  kategori: string
  beskrivelse: string
  tilleggsinfo: Tilleggsinfo[]
  tilbehør: Tilbehør[]
  endretHjelpemiddel?: EndretHjelpemiddel
}

export interface EndretHjelpemiddel {
  hmsNr: string
  begrunnelse: EndretHjelpemiddelBegrunnelse
  begrunnelseFritekst?: string
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
  fnr: string
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
  sakId: string
  sakstype: Oppgavetype
  status: OppgaveStatusType
  statusEndret: string
  beskrivelse: string
  mottatt: string
  innsender: string
  bruker: OppgaveBruker
  enhet: Enhet
  saksbehandler?: Saksbehandler | null
  kanTildeles: boolean
}

export interface OppgaveBruker {
  fnr: string
  fornavn: string
  mellomnavn?: string
  etternavn: string
  funksjonsnedsettelser: string[]
  bosted: string
}

export interface Journalpost {
  journalpostID: string
  journalpostOpprettetTid: string
  tittel: string
  fnrInnsender: string
  journalstatus: JournalpostStatusType
  status: DokumentOppgaveStatusType
  skjerming?: string
  enhet?: Enhet
  saksbehandler?: Saksbehandler
  dokumenter: Dokument[]
}

export interface Dokument {
  dokumentID: string
  tittel: string
  brevkode: string
  skjerming?: string
  vedlegg: any[]
  varianter: Array<{
    format: DokumentFormat
    skjerming?: string
  }>
}

export interface JournalføringRequest {
  journalpostID: string
  tittel: string
  journalføresPåFnr: string
}

export interface OpprettetSakResponse {
  sakId: string
}

export enum DokumentFormat {
  ARKIV = 'ARKIV',
  ORIGINAL = 'ORIGINAL',
}

export enum Oppgavetype {
  SØKNAD = 'SØKNAD',
  BESTILLING = 'BESTILLING',
  TILSKUDD = 'TILSKUDD',
  DOKUMENT = 'DOKUMENT',
  BARNEBRILLER = 'BARNEBRILLER',
}

export interface Saksbehandler {
  id: string
  objectId: string
  epost: string
  navn: string
}

export enum DokumentOppgaveStatusType {
  MOTTATT = 'MOTTATT',
  TILDELT_SAKSBEHANDLER = 'TILDELT_SAKSBEHANDLER',
  AVVENTER_JOURNALFØRING = 'AVVENTER_JOURNALFØRING',
  JOURNALFØRT = 'JOURNALFØRT',
}

export const DokumentStatusLabel = new Map<string, string>([
  [DokumentOppgaveStatusType.MOTTATT, 'Mottatt'],
  [DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER, 'Under behandling'],
  [DokumentOppgaveStatusType.JOURNALFØRT, 'Journalført'],
])

export enum JournalpostStatusType {
  MOTTATT = 'MOTATT',
}

export enum OppgaveStatusType {
  AVVENTER_SAKSBEHANDLER = 'AVVENTER_SAKSBEHANDLER',
  TILDELT_SAKSBEHANDLER = 'TILDELT_SAKSBEHANDLER',
  TILDELT_GODKJENNER = 'TILDELT_GODKJENNER',
  RETURNERT = 'RETURNERT',
  SENDT_GOSYS = 'SENDT_GOSYS',
  AVVIST = 'AVVIST',
  AVVENTER_GODKJENNER = 'AVVENTER_GODKJENNER',
  VEDTAK_FATTET = 'VEDTAK_FATTET',
  INNVILGET = 'INNVILGET',
  AVSLÅTT = 'AVSLÅTT',
  FERDIGSTILT = 'FERDIGSTILT',
  ALLE = 'ALLE',
}

export const OppgaveStatusLabel = new Map<OppgaveStatusType, string>([
  [OppgaveStatusType.ALLE, 'Alle'],
  [OppgaveStatusType.VEDTAK_FATTET, 'Innvilget'],
  [OppgaveStatusType.INNVILGET, 'Innvilget'],
  [OppgaveStatusType.AVSLÅTT, 'Avslått'],
  [OppgaveStatusType.AVVENTER_SAKSBEHANDLER, 'Mottatt'],
  [OppgaveStatusType.SENDT_GOSYS, 'Sendt GOSYS'],
  [OppgaveStatusType.TILDELT_SAKSBEHANDLER, 'Under behandling'],
  [OppgaveStatusType.TILDELT_GODKJENNER, 'Under totrinnskontroll'],
  [OppgaveStatusType.FERDIGSTILT, 'Godkjent'],
  [OppgaveStatusType.AVVIST, 'Avvist'],
  [OppgaveStatusType.AVVENTER_GODKJENNER, 'Til godkjenning'],
  [OppgaveStatusType.RETURNERT, 'Returnert'],
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

export interface Personinfo {
  fnr: string
  brukernummer?: string
  fornavn: string
  mellomnavn?: string | null
  etternavn: string
  fødselsdato: string | undefined
  kjønn: Kjønn
  adresse: string
  kilde: PersonInfoKilde
  signaturtype: SignaturType
  telefon: string
  funksjonsnedsettelser: string[]
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
  INSTITUSJON = 'INSTITUSJON',
}

export enum SignaturType {
  FULLMAKT = 'FULLMAKT',
  BRUKER_BEKREFTER = 'BRUKER_BEKREFTER',
  FRITAK_FRA_FULLMAKT = 'FRITAK_FRA_FULLMAKT',
}

export enum PersonInfoKilde {
  PDL = 'pdl',
  FORMIDLER = 'manuell',
}

export interface Produkt {
  isokode: string
  isotittel: string
  rammeavtalePostId: string
  produkturl: string
  artikkelurl: string
  posttittel: string
  artikkelnavn: string
  hmsnr: string
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
  SYN = 'SYN',
}

export enum SakstypeFilter {
  ALLE = 'ALLE',
  SØKNAD = 'SØKNAD',
  BESTILLING = 'BESTILLING',
  TILSKUDD = 'TILSKUDD',
}

export const SakerFilterLabel = new Map<string, string>([
  [SakerFilter.ALLE, 'Alle'],
  [SakerFilter.MINE, 'Mine saker'],
  [SakerFilter.UFORDELTE, 'Ufordelte'],
])

export const SakstypeFilterLabel = new Map<string, string>([
  [SakstypeFilter.ALLE, 'Alle'],
  [SakstypeFilter.BESTILLING, 'Bestilling'],
  [SakstypeFilter.SØKNAD, 'Søknad'],
  [SakstypeFilter.TILSKUDD, 'Tilskudd'],
])

export const OmrådeFilterLabel = new Map<string, string>([
  [OmrådeFilter.ALLE, 'Alle'],
  [OmrådeFilter.BEVEGELSE, 'Bevegelse'],
  [OmrådeFilter.HØRSEL, 'Hørsel'],
  [OmrådeFilter.KOGNISJON, 'Kognisjon'],
  [OmrådeFilter.SYN, 'Syn'],
])

export enum HøyrekolonneTabs {
  SAKSHISTORIKK = 'SAKSHISTORIKK',
  HJELPEMIDDELOVERSIKT = 'HJELPEMIDDELOVERSIKT',
  TOTRINNSKONTROLL = 'TOTRINNSKONTROLL',
}

export interface OverforGosysTilbakemelding {
  valgteArsaker: string[]
  begrunnelse: string
}

export interface AvvisBestilling {
  valgtArsak: string
  begrunnelse: string
}

export interface Person {
  fnr: string
  brukernummer?: string
  fødselsdato?: string
  kjønn: Kjønn
  telefon?: string
  fornavn: string
  mellomnavn?: string
  etternavn: string
  harAdressebeskyttelse: boolean
  kommune: Kommune
  bydel?: Bydel
  enhet: Enhet
}

export interface Saksoversikt {
  hotsakSaker: Saksoversikt_Sak[]
}

export interface Saksoversikt_Sak {
  sakId: string
  sakstype?: Oppgavetype
  mottattDato: string
  status: OppgaveStatusType
  statusEndretDato: string
  søknadGjelder: string
  saksbehandler?: string
  område: string[]
  fagsystem: string
}

export interface EndreHjelpemiddelRequest {
  hjelpemiddelId: number
  hmsNr: string
  hmsBeskrivelse: string
  endretHmsNr: string
  endretHmsBeskrivelse: string
  begrunnelse: EndretHjelpemiddelBegrunnelse
  begrunnelseFritekst?: string
}

export enum EndretHjelpemiddelBegrunnelse {
  RAMMEAVTALE = 'RAMMEAVTALE',
  GJENBRUK = 'GJENBRUK',
  ANNET = 'ANNET',
}

export const EndretHjelpemiddelBegrunnelseLabel = new Map<string, string>([
  [EndretHjelpemiddelBegrunnelse.RAMMEAVTALE, 'Endring i rammeavtale'],
  [EndretHjelpemiddelBegrunnelse.GJENBRUK, 'Gjenbruk'],
  [EndretHjelpemiddelBegrunnelse.ANNET, 'Annet'],
])

export interface Hjelpemiddel {
  hmsnr: string
  navn: string
}

export enum RessursStatus {
  FEILET = 'FEILET',
  FUNKSJONELL_FEIL = 'FUNKSJONELL_FEIL',
  HENTER = 'HENTER',
  IKKE_HENTET = 'IKKE_HENTET',
  IKKE_TILGANG = 'IKKE_TILGANG',
  SUKSESS = 'SUKSESS',
}

export type Ressurs<T> =
  | {
      status: RessursStatus.IKKE_HENTET
    }
  | {
      status: RessursStatus.HENTER
    }
  | {
      data: T
      status: RessursStatus.SUKSESS
    }
  | {
      frontendFeilmelding: string
      status: RessursStatus.IKKE_TILGANG
    }
  | {
      frontendFeilmelding: string
      status: RessursStatus.FEILET
    }
  | {
      frontendFeilmelding: string
      status: RessursStatus.FUNKSJONELL_FEIL
    }

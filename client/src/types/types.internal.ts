export interface Saksinformasjon {
  opprettet: string
}

export interface HarSakskjerne {
  saksinformasjon: Saksinformasjon
  saksbehandler?: Saksbehandler
}

export interface SakResponse {
  kanTildeles: boolean
  data: Sak
}

export interface BarnebrillesakResponse {
  kanTildeles: boolean
  data: Barnebrillesak
}

export interface Sak extends HarSakskjerne {
  sakId: string
  sakstype: Sakstype
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

export interface Barnebrillesak extends HarSakskjerne {
  sakId: string
  sakstype: Sakstype
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
  data?: Satsberegning
  vilkår: Vilkår[]
}

export interface Satsberegning {
  sats: SatsType
  satsBeløp: number
  satsBeskrivelse: string
  beløp: string
}

export interface Vilkår extends Vurdering {
  id: string
  vilkårId: string
  beskrivelse: string
  maskinellVurdering?: Vurdering
  manuellVurdering?: Vurdering
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
  lagtInnAvSaksbehandler: boolean
  beskrivelse: string
  transform?(verdi: string | number): string | number
}

export type GrunnlagType = keyof Grunnlag

export enum VilkårsResultat {
  JA = 'JA',
  NEI = 'NEI',
  KANSKJE = 'KANSKJE',
  OPPLYSNINGER_MANGLER = 'OPPLYSNINGER_MANGLER',
}

export interface RegistrerSøknadData {
  målform: MålformType
  brilleseddel: Brilleseddel
  bestillingsdato: Date
  bestiltHosOptiker: VurderingData
  komplettBrille: VurderingData
  kjøptBrille: KjøptBrille
}

export interface KjøptBrille {
  vilkårOppfylt?: VilkårsResultat | ''
  brillepris: string
}

export interface Brillegrunnlag {
  brilleseddel: Brilleseddel
  bestillingsdato: Date
  brillepris: string
  bestiltHosOptiker: Vurdering
  komplettBrille: Vurdering
}

export interface VurderingData {
  vilkårOppfylt?: VilkårsResultat | ''
  begrunnelse?: string
}

export interface Vurdering {
  vilkårOppfylt?: VilkårsResultat
  begrunnelse?: string
}

export interface OppdaterVilkårData {
  resultatSaksbehandler: VilkårsResultat | ''
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
  resultatSaksbehandler: VilkårsResultat
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
  sakstype: Sakstype
  målform: MålformType
  data: {
    brilleseddel?: Brilleseddel
    bestillingsdato?: string
    brillepris?: string
    bestiltHosOptiker: VurderingData
    komplettBrille: VurderingData
    kjøptBrille?: VurderingData
  }
}

export type Vilkårsgrunnlag = VurderVilkårRequest

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
  bestillingsdato?: string
}

export enum StegType {
  INNHENTE_FAKTA = 'INNHENTE_FAKTA',
  VURDERE_VILKÅR = 'VURDERE_VILKÅR',
  FATTE_VEDTAK = 'FATTE_VEDTAK',
  GODKJENNE = 'GODKJENNE',
  REVURDERE = 'REVURDERE',
  FERDIG_BEHANDLET = 'FERDIG_BEHANDLET',
}

export enum StepType {
  REGISTRER = 1,
  VILKÅR = 2,
  FATTE_VEDTAK = 3,
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

export interface AdressebeskyttelseOgSkjerming {
  gradering?: Adressebeskyttelse[]
  skjermet: boolean
}

export interface Innsender {
  fnr: string
  navn: string | Navn
  fulltNavn?: string
  adressebeskyttelseOgSkjerming: AdressebeskyttelseOgSkjerming
}

export interface Bruker {
  fnr: string
  navn: Navn
  fulltNavn?: string
  fødselsdato: string
  kommune: Kommune
  bydel?: Bydel
  kjønn?: Kjønn
  telefon?: string
  brukernummer?: string
  kontonummer?: string
  adressebeskyttelseOgSkjerming: AdressebeskyttelseOgSkjerming
}

export enum Adressebeskyttelse {
  FORTROLIG = 'FORTROLIG',
  STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
  STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
}

export const AdressebeskyttelseAlert = {
  [Adressebeskyttelse.FORTROLIG]: 'Fortrolig adresse',
  [Adressebeskyttelse.STRENGT_FORTROLIG]: 'Strengt fortrolig adresse',
  [Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND]: 'Strengt fortrolig adresse utland',
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

export interface VedtakPayload {
  sakId: number | string
  status: VedtakStatusType
}

export interface Vedtaksgrunnlag {
  type: VedtaksgrunnlagType
  data: any[] | undefined
}

export interface Hendelse {
  id: string
  hendelse: string
  opprettet: string
  bruker?: string
  detaljer?: string
}

export interface Notat {
  id: number
  sakId: string
  saksbehandler: Saksbehandler
  type: 'INTERNT'
  innhold: string
  opprettet: string
  slettet?: string
}

export interface BrevTekst {
  sakId: string
  målform: MålformType
  data: { brevtekst: string }
  brevtype: string
}

export interface Artikkel {
  hmsnr: string
  navn: string
  antall: number
  finnesIOebs: boolean
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
  saksbehandlerRef: string
  saksbehandlerNavn: string
  soknadUuid: string
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
  navn: string | Navn
  fulltNavn?: string
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

export enum Oppgavetype {
  JOURNALFØRING = 'JOURNALFØRING',
  BEHANDLE_SAK = 'BEHANDLE_SAK',
  GODKJENNE_VEDTAK = 'GODKJENNE_VEDTAK',
}

export enum Oppgavestatus {
  OPPRETTET = 'OPPRETTET',
  ÅPNET = 'ÅPNET',
  UNDER_BEHANDLING = 'UNDER_BEHANDLING',
  FERDIGSTILT = 'FERDIGSTILT',
  FEILREGISTRERT = 'FEILREGISTRERT',
}

export const OppgavestatusLabel = new Map<string, string>([
  [Oppgavestatus.OPPRETTET, 'Mottatt'],
  [Oppgavestatus.ÅPNET, 'Mottatt'],
  [Oppgavestatus.UNDER_BEHANDLING, 'Under journalføring'],
  [Oppgavestatus.FERDIGSTILT, 'Journalført'],
  [Oppgavestatus.FEILREGISTRERT, 'Feilregistrert'],
])

/* Midlertidig uheldig navn. Rename til Oppgave når Oppgavetypen er fjernet når vi er ver på å bruke ny oppgavemodell */
export interface OppgaveV2 {
  id: string
  oppgavetype: Oppgavetype
  oppgavestatus: Oppgavestatus
  beskrivelse: string
  //TODO Fiks type på tvers her for å unngå string
  område: string[]
  //område: OmrådeFilter[]
  enhet: Enhet
  kommune?: Kommune
  bydel?: Bydel
  saksbehandler?: Saksbehandler
  journalpostId?: string
  sakId?: string
  frist: string
  opprettet: string
  endret?: string
  bruker: {
    fnr: string
    fulltNavn?: string
  }
  innsender?: {
    fnr: string
    fulltNavn?: string
  }
}

export interface OppgaverResponse {
  oppgaver: OppgaveV2[]
  totalCount: number
}

export interface Bydel {
  bydelsnummer: string
  bydelsnavn: string
}

/*export interface Kommune {
  kommunenummer: string
  kommunenavn: string
}*/

/* Bør fjernes når vi er over på ny Oppgavemodell*/
export interface Oppgave {
  sakId: string
  sakstype: Sakstype
  status: OppgaveStatusType
  statusEndret: string
  beskrivelse: string
  mottatt: string
  innsender: string
  bruker: OppgaveBruker
  enhet: Enhet
  saksbehandler?: Saksbehandler
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
  oppgave: OppgaveV2
  innsender: FødselsnummerOgNavn
  bruker?: FødselsnummerOgNavn
}

export interface FødselsnummerOgNavn {
  fnr: string
  navn: string | Navn
  fulltNavn?: string
}

export interface Dokument {
  journalpostID: string
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

export enum SaksdokumentType {
  INNGÅENDE = 'INNGÅENDE',
  UTGÅENDE = 'UTGÅENDE',
  NOTAT = 'NOTAT',
}

export enum Brevkode {
  INNHENTE_OPPLYSNINGER_BARNEBRILLER = 'innhente_opplysninger_barnebriller',
}

export interface Saksdokument {
  sakId: string
  journalpostID: string
  type: SaksdokumentType
  opprettet: string
  dokumentID: string
  saksbehandler: Saksbehandler
  tittel: string
  brevkode?: string
  skjerming?: string
  vedlegg?: any[]
  varianter?: Array<{
    format: DokumentFormat
    skjerming?: string
  }>
}

export interface JournalføringRequest {
  journalpostID: string
  tittel: string
  journalføresPåFnr: string
  sakId?: string
}

export interface OpprettetSakResponse {
  sakId: string
}

export enum DokumentFormat {
  ARKIV = 'ARKIV',
  ORIGINAL = 'ORIGINAL',
}

export enum Sakstype {
  SØKNAD = 'SØKNAD',
  BESTILLING = 'BESTILLING',
  TILSKUDD = 'TILSKUDD',
  DOKUMENT = 'DOKUMENT',
  BARNEBRILLER = 'BARNEBRILLER',
}

export interface Saksbehandler {
  id: string
  navn: string
  epost: string
}

export enum DokumentOppgaveStatusType {
  MOTTATT = 'MOTTATT',
  TILDELT_SAKSBEHANDLER = 'TILDELT_SAKSBEHANDLER',
  AVVENTER_JOURNALFØRING = 'AVVENTER_JOURNALFØRING',
  JOURNALFØRT = 'JOURNALFØRT',
}

/*export const DokumentStatusLabel = new Map<string, string>([
  [DokumentOppgaveStatusType.MOTTATT, 'Mottatt'],
  [DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER, 'Under journalføring'],
  [DokumentOppgaveStatusType.JOURNALFØRT, 'Journalført'],
])*/

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
  AVVENTER_DOKUMENTASJON = 'AVVENTER_DOKUMENTASJON',
  VEDTAK_FATTET = 'VEDTAK_FATTET',
  INNVILGET = 'INNVILGET',
  AVSLÅTT = 'AVSLÅTT',
  FERDIGSTILT = 'FERDIGSTILT',
  ALLE = 'ALLE',
}

export enum BehandlingstatusType {
  ÅPEN = 'ÅPEN',
  SAKSBEHANDLING_AVSLUTTET = 'SAKSBEHANDLING_AVSLUTTET',
  PÅ_VENT = 'PÅ_VENT',
}

export const OppgaveStatusLabel = new Map<OppgaveStatusType, string>([
  [OppgaveStatusType.ALLE, 'Alle'],
  [OppgaveStatusType.INNVILGET, 'Innvilget'],
  [OppgaveStatusType.AVSLÅTT, 'Avslått'],
  [OppgaveStatusType.AVVENTER_SAKSBEHANDLER, 'Mottatt'],
  [OppgaveStatusType.AVVENTER_DOKUMENTASJON, 'Avventer opplysninger'],
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
  AVSLÅTT = 'AVSLÅTT',
}

export const VedtakStatusLabel = new Map<VedtakStatusType, string>([
  [VedtakStatusType.INNVILGET, 'Innvilget'],
  [VedtakStatusType.AVSLÅTT, 'Avslått'],
])

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
  bruksarena: Bruksarena | null
  bosituasjon: Bosituasjon | null
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
  UKJENT = 'UKJENT',
}

export enum Bosituasjon {
  HJEMME = 'HJEMME',
  HJEMME_EGEN_BOLIG = 'HJEMME_EGEN_BOLIG',
  HJEMME_OMSORG_FELLES = 'HJEMME_OMSORG_FELLES',
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
  isotittel: string
  produkturl: string
  posttitler?: string[]
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
}

export enum BarnebrilleSidebarTabs {
  SAKSHISTORIKK = 'SAKSHISTORIKK',
  TOTRINNSKONTROLL = 'TOTRINNSKONTROLL',
  SEND_BREV = 'SEND_BREV',
  NOTAT = 'NOTAT',
}

export enum Brevtype {
  BARNEBRILLER_VEDTAK = 'BARNEBRILLER_VEDTAK',
  BARNEBRILLER_INNHENTE_OPPLYSNINGER = 'BARNEBRILLER_INNHENTE_OPPLYSNINGER',
}

export interface OverforGosysTilbakemelding {
  valgteArsaker: string[]
  begrunnelse: string
}

export interface AvvisBestilling {
  valgtArsak: string
  begrunnelse: string
}

export interface Person extends Navn {
  fnr: string
  navn: Navn
  fødselsdato?: string
  telefon?: string
  brukernummer?: string
  kjønn: Kjønn
  enhet: Enhet
  kommune: Kommune
  bydel?: Bydel
  adressebeskyttelseOgSkjerming: AdressebeskyttelseOgSkjerming
}

export interface Saksoversikt {
  hotsakSaker: Saksoversikt_Sak[]
  barnebrilleSaker?: Saksoversikt_Barnebrille_Sak[]
}

export interface Saksoversikt_Sak {
  sakId: string
  sakstype?: Sakstype
  mottattDato: string
  status: OppgaveStatusType
  statusEndretDato: string
  søknadGjelder: string
  saksbehandler?: string
  område: string[]
  fagsystem: string
}

export interface Saksoversikt_Barnebrille_Sak {
  sak: Saksoversikt_Sak
  journalpostId?: number
  dokumentId?: string
}

export interface Saksoversikt_Sak_Felles_Type {
  sak: Saksoversikt_Sak
  barnebrilleSak?: Saksoversikt_Barnebrille_Sak
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

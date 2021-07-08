import { Dayjs } from 'dayjs'

import { Utbetalingsperiode } from './types.external'

export interface Oppgave {
  opprettetDato: Dayjs
  motattDato: Dayjs
  saksid: string
  personinfo: Personinfo
  funksjonsnedsettelse: string[]
  status: StatusType
  saksbehandler?: Saksbehandler
  søknadOm: string
}

export enum StatusType {
  MOTTATT = 'mottatt',
  OVERFØRT_GOSYS = 'overført_gosys',
  INNVILGET = 'innvilget',
}

/* ---- */

export interface Periode {
  fom: Dayjs
  tom: Dayjs
}

export interface Basisvilkår {
  oppfylt?: boolean
}

export interface DagerIgjen extends Basisvilkår {
  dagerBrukt?: number
  skjæringstidspunkt: Dayjs
  førsteSykepengedag?: Dayjs
  maksdato?: Dayjs
  gjenståendeDager?: number
  tidligerePerioder: Periode[]
}

export interface Søknadsfrist extends Basisvilkår {
  søknadFom?: Dayjs
  sendtNav?: Dayjs
}

export interface Opptjening extends Basisvilkår {
  antallOpptjeningsdagerErMinst: number
  opptjeningFra: Dayjs
}

export interface Alder extends Basisvilkår {
  alderSisteSykedag: number
}

export interface Vilkår {
  alder: Alder
  dagerIgjen: DagerIgjen
  sykepengegrunnlag: SykepengegrunnlagVilkår
  opptjening?: Opptjening | Basisvilkår
  søknadsfrist?: Søknadsfrist
  medlemskap?: Basisvilkår
}

export interface SykepengegrunnlagVilkår {
  sykepengegrunnlag?: number
  oppfylt?: boolean
  grunnebeløp: number
}

export interface Arbeidsforhold {
  stillingstittel: string
  stillingsprosent: number
  startdato: Dayjs
  sluttdato?: Dayjs
}

export interface Oppsummering {
  antallUtbetalingsdager: number
  totaltTilUtbetaling: number
}

export enum Kildetype {
  Sykmelding = 'Sykmelding',
  Søknad = 'Søknad',
  Inntektsmelding = 'Inntektsmelding',
  Saksbehandler = 'Saksbehandler',
  Aordningen = 'Aordningen',
  Ainntekt = 'Ainntekt',
}

export enum Periodetype {
  Forlengelse = 'forlengelse',
  Førstegangsbehandling = 'førstegangsbehandling',
  Infotrygdforlengelse = 'infotrygdforlengelse',
  OvergangFraInfotrygd = 'overgangFraIt',
  Stikkprøve = 'stikkprøve',
  RiskQa = 'riskQa',
  Revurdering = 'revurdering',
}

export interface Søknad {
  id: string
  type: Kildetype.Søknad
  fom: Dayjs
  tom: Dayjs
  rapportertDato?: Dayjs
  sendtNav: Dayjs
}

export interface Sykmelding {
  id: string
  type: Kildetype.Sykmelding
  fom: Dayjs
  tom: Dayjs
  rapportertDato?: Dayjs
}

export interface Inntektsmelding {
  id: string
  type: Kildetype.Inntektsmelding
  beregnetInntekt: number
  mottattTidspunkt: Dayjs
}

export interface Risikovurdering {
  funn: Faresignal[]
  kontrollertOk: Faresignal[]
}

export interface Faresignal {
  kreverSupersaksbehandler: boolean
  beskrivelse: string
  kategori: string[]
}

export type Dokument = Søknad | Sykmelding | Inntektsmelding

export enum Dagtype {
  Syk = 'Syk',
  Helg = 'Helg',
  Ferie = 'Ferie',
  Avvist = 'Avslått',
  Ubestemt = 'Ubestemt',
  Arbeidsdag = 'Arbeidsdag',
  Egenmelding = 'Egenmelding',
  Foreldet = 'Foreldet',
  Arbeidsgiverperiode = 'Arbeidsgiverperiode',
  Annullert = 'Annullert',
  Permisjon = 'Permisjon',
}

export interface Dag {
  dato: Dayjs
  type: Dagtype
  gradering?: number
}

export interface Sykdomsdag extends Dag {
  kildeId?: string
  kilde?: Kildetype
}

export interface Utbetalingsdag extends Dag {
  totalGradering?: number
  utbetaling?: number
  avvistÅrsaker?: AvvistBegrunnelse[]
}

export type AvvistBegrunnelseTekst =
  | 'EtterDødsdato'
  | 'EgenmeldingUtenforArbeidsgiverperiode'
  | 'MinimumSykdomsgrad'
  | 'MinimumInntekt'
  | 'ManglerOpptjening'
  | 'ManglerMedlemskap'
  | 'SykepengedagerOppbrukt'

export interface AvvistBegrunnelse {
  tekst: AvvistBegrunnelseTekst
  paragraf?: string
}

export enum Revurderingtilstand {
  Revurderes = 'revurderes',
  Revurdert = 'revurdert',
  Ukjent = 'ukjent',
}

export enum Vedtaksperiodetilstand {
  TilUtbetaling = 'tilUtbetaling',
  Utbetalt = 'utbetalt',
  Oppgaver = 'oppgaver',
  Venter = 'venter',
  VenterPåKiling = 'venterPåKiling',
  Avslag = 'avslag',
  IngenUtbetaling = 'ingenUtbetaling',
  KunFerie = 'kunFerie',
  KunPermisjon = 'kunPermisjon',
  Feilet = 'feilet',
  Ukjent = 'ukjent',
  TilInfotrygd = 'tilInfotrygd',
  Annullert = 'annullert',
  TilAnnullering = 'tilAnnullering',
  AnnulleringFeilet = 'annulleringFeilet',
  UtbetaltAutomatisk = 'utbetaltAutomatisk',
  TilUtbetalingAutomatisk = 'tilUtbetalingAutomatisk',
}

export enum Infotrygdperiodetilstand {
  UtbetaltIInfotrygd = 'utbetaltIInfotrygd',
  Infotrygdferie = 'infotrygdferie',
  Infotrygdukjent = 'infotrygdukjent',
}

export interface UfullstendigVedtaksperiode {
  id: string
  fom: Dayjs
  tom: Dayjs
  fullstendig: boolean
  tilstand: Vedtaksperiodetilstand
  utbetalingstidslinje: Utbetalingsdag[]
  sykdomstidslinje?: Sykdomsdag[]
  erNyeste?: boolean
  beregningIder?: string[]
}

export interface Vedtaksperiode {
  id: string
  fom: Dayjs
  tom: Dayjs
  gruppeId: string
  arbeidsgivernavn: string
  forlengelseFraInfotrygd?: boolean
  periodetype: Periodetype
  behandlet: boolean
  tilstand: Vedtaksperiodetilstand
  oppgavereferanse?: string
  fullstendig: boolean
  erForkastet: boolean
  utbetalingsreferanse?: string
  utbetalingstidslinje: Utbetalingsdag[]
  sykdomstidslinje: Sykdomsdag[]
  automatiskBehandlet: boolean
  godkjentAv?: string
  godkjenttidspunkt?: Dayjs
  vilkår?: Vilkår
  inntektsgrunnlag: Inntektsgrunnlag
  utbetalinger?: Utbetalinger
  oppsummering: Oppsummering
  simuleringsdata?: Simulering
  hendelser: Dokument[]
  aktivitetslog: string[]
  risikovurdering?: Risikovurdering
  overstyringer: Overstyring[]
  erNyeste: boolean
  beregningIder: string[]
  inntektskilde: InntektskildeType
}

export interface Utbetalinger {
  arbeidsgiverUtbetaling?: Utbetaling
  personUtbetaling?: Utbetaling
}

export interface Utbetaling {
  fagsystemId: string
  linjer: Utbetalingslinje[]
}

export interface Utbetalingslinje {
  fom: Dayjs
  tom: Dayjs
  dagsats: number
  grad: number
}

export interface AnnullertAvSaksbehandler {
  annullertTidspunkt: Dayjs
  saksbehandlerNavn: string
}

export interface Simulering {
  totalbeløp: number
  perioder: Utbetalingsperiode[]
}

/*export interface Arbeidsgiver {
    organisasjonsnummer: string;
    id: string;
    navn: string;
    utbetalingshistorikk: UtbetalingshistorikkElement[];
    tidslinjeperioder: Tidslinjeperiode[][];
    vedtaksperioder: (Vedtaksperiode | UfullstendigVedtaksperiode)[];
    arbeidsforhold: Arbeidsforhold[];
}*/

export type Kjønn = 'mann' | 'kvinne' | 'ukjent'

export interface Personinfo {
  fornavn: string
  mellomnavn: string | null
  etternavn: string
  fødselsdato: Dayjs | null
  kjønn: Kjønn
  fnr: string
  brukernummer?: string
  adresse: string
  postnummer: string
  poststed: string
  gtNummer: string
  gtType: string
  egenAnsatt: boolean
  brukerErDigital: boolean
}

export interface Person {
  aktørId: string
  //arbeidsgivere: Arbeidsgiver[];
  utbetalinger: UtbetalingshistorikkUtbetaling[]
  personinfo: Personinfo
  fødselsnummer: string
  infotrygdutbetalinger: Infotrygdutbetaling[]
  enhet: Enhetsinfo
  dødsdato?: Dayjs
  tildeling?: TildelingType
}

export interface Enhetsinfo {
  id: string
  navn: string
}

export interface Infotrygdutbetaling {
  fom: Dayjs
  tom: Dayjs
  grad?: number
  dagsats?: number
  typetekst: InfotrygdTypetekst
  organisasjonsnummer: string
}

export enum InfotrygdTypetekst {
  FERIE = 'Ferie',
  UTBETALING = 'Utbetaling',
  ARBEIDSGIVERREFUSJON = 'ArbRef',
  UKJENT = 'Ukjent',
  TILBAKEFØRT = 'Tilbakeført',
}

export interface Overstyring {
  hendelseId: string
  begrunnelse: string
  timestamp: Dayjs
  overstyrteDager: OverstyrtDag[]
  saksbehandlerNavn: string
}

export interface OverstyrtDag {
  dato: Dayjs
  type: Dagtype
  grad?: number
}

export interface Inntektsgrunnlag {
  organisasjonsnummer: string
  skjæringstidspunkt: Dayjs
  sykepengegrunnlag?: number
  omregnetÅrsinntekt?: number
  sammenligningsgrunnlag?: number
  avviksprosent?: number
  maksUtbetalingPerDag?: number
  inntekter: Arbeidsgiverinntekt[]
}

export interface Arbeidsgiverinntekt {
  arbeidsgivernavn: string
  organisasjonsnummer: string
  omregnetÅrsinntekt?: OmregnetÅrsinntekt
  sammenligningsgrunnlag?: Sammenligningsgrunnlag
  bransjer: string[]
  forskuttering: boolean
  refusjon: boolean
  arbeidsforhold: Arbeidsforhold[]
}

export interface OmregnetÅrsinntekt {
  kilde: Inntektskildetype
  beløp: number
  månedsbeløp: number
  inntekterFraAOrdningen?: InntekterFraAOrdningen[] //kun gyldig for A-ordningen
}

export enum Inntektskildetype {
  Saksbehandler = 'Saksbehandler',
  Inntektsmelding = 'Inntektsmelding',
  Infotrygd = 'Infotrygd',
  AOrdningen = 'AOrdningen',
}

export interface InntekterFraAOrdningen {
  måned: string
  sum: number
}

export interface Sammenligningsgrunnlag {
  beløp: number
  inntekterFraAOrdningen: InntekterFraAOrdningen[]
}

export interface UtbetalingshistorikkUtbetaling {
  status: string
  type: string
  arbeidsgiverOppdrag: UtbetalingshistorikkArbeidsgiverOppdrag
  annullering?: AnnullertAvSaksbehandler
  totalbeløp: number | null
}

export interface UtbetalingshistorikkArbeidsgiverOppdrag {
  orgnummer: string
  fagsystemId: string
  utbetalingslinjer: UtbetalingshistorikkUtbetalingslinje[]
}

export interface UtbetalingshistorikkUtbetalingslinje {
  fom: Dayjs
  tom: Dayjs
}

export interface TildelingType {
  saksbehandler: Saksbehandler
  påVent: boolean
}

export enum InntektskildeType {
  EnArbeidsgiver = 'EN_ARBEIDSGIVER',
  FlereArbeidsgivere = 'FLERE_ARBEIDSGIVERE',
}

export interface UtbetalingshistorikkUtbetaling2 {
  // status: Utbetalingstatus;
  type: Utbetalingstype
  utbetalingstidslinje: Utbetalingsdag[]
  maksdato: Dayjs
  gjenståendeDager: number
  forbrukteDager: number
  nettobeløp: number
  arbeidsgiverFagsystemId: string
  vurdering?: Vurdering
}

export interface Vurdering {
  godkjent: boolean
  tidsstempel: Dayjs
  automatisk: boolean
  ident: string
}

export enum Utbetalingstype {
  UTBETALING = 'UTBETALING',
  ANNULLERING = 'ANNULLERING',
  ETTERUTBETALING = 'ETTERUTBETALING',
  REVURDERING = 'REVURDERING',
  UKJENT = 'UKJENT',
}

export interface Error {
  message: string
  statusCode?: number
  technical?: string
}

export interface Saksbehandler {
  oid: string
  epost: string
  navn: string
}

export interface Behandlingsstatistikk {
  antallOppgaverTilGodkjenning: {
    totalt: number
    perPeriodetype: {
      periodetype: Periodetype
      antall: number
    }[]
  }
  antallTildelteOppgaver: {
    totalt: number
    perPeriodetype: {
      periodetype: Periodetype
      antall: number
    }[]
  }
  fullførteBehandlinger: {
    totalt: number
    manuelt: number
    automatisk: number
    annulleringer: number
  }
}

export enum Tidslinjetilstand {
  TilUtbetaling = 'tilUtbetaling',
  Utbetalt = 'utbetalt',
  Oppgaver = 'oppgaver',
  Venter = 'venter',
  VenterPåKiling = 'venterPåKiling',
  Avslag = 'avslag',
  IngenUtbetaling = 'ingenUtbetaling',
  KunFerie = 'kunFerie',
  KunPermisjon = 'kunPermisjon',
  Feilet = 'feilet',
  TilInfotrygd = 'tilInfotrygd',
  Annullert = 'annullert',
  TilAnnullering = 'tilAnnullering',
  AnnulleringFeilet = 'annulleringFeilet',
  UtbetaltAutomatisk = 'utbetaltAutomatisk',
  TilUtbetalingAutomatisk = 'tilUtbetalingAutomatisk',
  Revurderes = 'revurderes',
  Revurdert = 'revurdert',
  Ukjent = 'ukjent',
}

export interface Utbetalingsdetalj {
  sats: number
  konto: string
  belop: number
  typeSats: string
  uforegrad: number
  antallSats: number
  faktiskFom: string
  faktiskTom: string
  klassekode: string
  tilbakeforing: boolean
  refunderesOrgNr: string
  utbetalingsType: string
  klassekodeBeskrivelse: string
}

export interface SpesialistUtbetaling {
  status: string
  type: string
  arbeidsgiverOppdrag: SpesialistArbeidsgiverOppdrag
  annullertAvSaksbehandler?: SpesialistAnnulertAvSaksbehandler | null
  totalbeløp: number | null
}

export interface SpesialistAnnulertAvSaksbehandler {
  annullertTidspunkt: string
  saksbehandlerNavn: string
}

export interface SpesialistArbeidsgiverOppdrag {
  organisasjonsnummer: string
  fagsystemId: string
  utbetalingslinjer: SpesialistUtbetalingslinje[]
}

export interface SpesialistUtbetalingslinje {
  fom: string
  tom: string
}

export interface Utbetaling {
  forfall: string
  detaljer: Utbetalingsdetalj[]
  feilkonto: boolean
  utbetalesTilId: string
  utbetalesTilNavn: string
}

export interface SpleisUtbetalingslinje {
  fom: string
  tom: string
  dagsats: number
  grad: number
}

export interface Utbetalingsperiode {
  fom: string
  tom: string
  utbetalinger: Utbetaling[]
}

export enum SpleisUtbetalingsdagtype {
  ARBEIDSGIVERPERIODE = 'ArbeidsgiverperiodeDag',
  NAVDAG = 'NavDag',
  NAVHELG = 'NavHelgDag',
  ARBEIDSDAG = 'Arbeidsdag',
  FERIEDAG = 'Feriedag',
  HELGEDAG = 'Helgedag',
  UKJENTDAG = 'UkjentDag',
  AVVISTDAG = 'AvvistDag',
  FORELDETDAG = 'ForeldetDag',
}

export interface SpleisUtbetalingsdag {
  type: SpleisUtbetalingsdagtype
  inntekt: number
  dato: string
  utbetaling?: number
  grad?: number
  totalGrad?: number
  begrunnelser?: string[]
}

export enum SpleisSykdomsdagtype {
  ARBEIDSDAG = 'ARBEIDSDAG',
  ARBEIDSGIVERDAG = 'ARBEIDSGIVERDAG',
  FERIEDAG = 'FERIEDAG',
  FORELDET_SYKEDAG = 'FORELDET_SYKEDAG',
  FRISK_HELGEDAG = 'FRISK_HELGEDAG',
  IMPLISITT_DAG = 'IMPLISITT_DAG',
  PERMISJONSDAG = 'PERMISJONSDAG',
  STUDIEDAG = 'STUDIEDAG',
  SYKEDAG = 'SYKEDAG',
  SYK_HELGEDAG = 'SYK_HELGEDAG',
  UBESTEMTDAG = 'UBESTEMTDAG',
  UTENLANDSDAG = 'UTENLANDSDAG',
  ARBEIDSDAG_INNTEKTSMELDING = 'ARBEIDSDAG_INNTEKTSMELDING',
  ARBEIDSDAG_SØKNAD = 'ARBEIDSDAG_SØKNAD',
  EGENMELDINGSDAG_INNTEKTSMELDING = 'EGENMELDINGSDAG_INNTEKTSMELDING',
  EGENMELDINGSDAG_SØKNAD = 'EGENMELDINGSDAG_SØKNAD',
  FERIEDAG_INNTEKTSMELDING = 'FERIEDAG_INNTEKTSMELDING',
  FERIEDAG_SØKNAD = 'FERIEDAG_SØKNAD',
  FRISK_HELGEDAG_INNTEKTSMELDING = 'FRISK_HELGEDAG_INNTEKTSMELDING',
  FRISK_HELGEDAG_SØKNAD = 'FRISK_HELGEDAG_SØKNAD',
  PERMISJONSDAG_SØKNAD = 'PERMISJONSDAG_SØKNAD',
  SYKEDAG_SYKMELDING = 'SYKEDAG_SYKMELDING',
  SYKEDAG_SØKNAD = 'SYKEDAG_SØKNAD',
  SYK_HELGEDAG_SYKMELDING = 'SYK_HELGEDAG_SYKMELDING',
  SYK_HELGEDAG_SØKNAD = 'SYK_HELGEDAG_SØKNAD',
  ANNULLERT_DAG = 'ANNULLERT_DAG',
}

export interface EksternSykdomsdag {
  dagen: string
  type: SpleisSykdomsdagtype
  kilde?: SpleisSykdomsdagkilde
  grad?: number
}

export interface SpleisSykdomsdagkilde {
  type: SpleisSykdomsdagkildeType
  kildeId: string | null
}

export enum SpleisSykdomsdagkildeType {
  INNTEKTSMELDING = 'Inntektsmelding',
  SYKMELDING = 'Sykmelding',
  SØKNAD = 'Søknad',
  SAKSBEHANDLER = 'Saksbehandler',
}

export enum SpleisHendelsetype {
  INNTEKTSMELDING = 'INNTEKTSMELDING',
  SYKMELDING = 'NY_SØKNAD',
  SØKNAD_NAV = 'SENDT_SØKNAD_NAV',
  SØKNAD_ARBEIDSGIVER = 'SENDT_SØKNAD_ARBEIDSGIVER',
}

export interface SpleisHendelse {
  id: string
  type: SpleisHendelsetype
}

export interface SpleisSøknad extends SpleisHendelse {
  fom: string
  tom: string
  rapportertdato: string // date time
  sendtNav: string // date time
}

export interface SpleisSykmelding extends SpleisHendelse {
  fom: string
  tom: string
  rapportertdato: string // date time
}

export interface SpleisInntektsmelding extends SpleisHendelse {
  mottattDato: string // date time
  beregnetInntekt: number
}

export interface SpesialistArbeidsforhold {
  organisasjonsnummer: string
  stillingstittel: string
  stillingsprosent: number
  startdato: string
  sluttdato?: string
}

export interface SpesialistPersoninfo {
  fornavn: string
  mellomnavn: string | null
  etternavn: string
  kjønn: string | null
  fødselsdato: string | null
}

export enum SpesialistPeriodetype {
  Forlengelse = 'FORLENGELSE',
  Førstegangsbehandling = 'FØRSTEGANGSBEHANDLING',
  Infotrygdforlengelse = 'INFOTRYGDFORLENGELSE',
  OvergangFraInfotrygd = 'OVERGANG_FRA_IT',
  Stikkprøve = 'STIKKPRØVE',
  RiskQa = 'RISK_QA',
}

export enum Oppgavetype {
  Søknad = 'SØKNAD',
}

export interface SpesialistOppgave {
  oppgavereferanse: string
  opprettet: string
  vedtaksperiodeId: string
  personinfo: SpesialistPersoninfo
  fødselsnummer: string
  aktørId: string
  antallVarsler: number
  type: SpesialistPeriodetype
  oppgavetype: Oppgavetype
  boenhet: SpesialistBoenhet
  inntektskilde?: SpesialistInntektskilde
  tildeling?: EksternTildeling
}

interface SpesialistBoenhet {
  id: string
  navn: string
}

export interface SpesialistPerson {
  aktørId: string
  fødselsnummer: string
  utbetalinger: SpesialistUtbetaling[]
  arbeidsgivere: SpesialistArbeidsgiver[]
  inntektsgrunnlag?: SpesialistInntektsgrunnlag[]
  personinfo: SpesialistPersoninfo
  enhet: Enhet
  arbeidsforhold: SpesialistArbeidsforhold[]
  infotrygdutbetalinger?: SpesialistInfotrygdutbetaling[]
  dødsdato?: string
  tildeling?: EksternTildeling
}

interface EksternTildeling {
  oid: string
  epost: string
  påVent: boolean
  navn: string
}

interface Enhet {
  id: string
  navn: string
}

export interface SpesialistRisikovurdering {
  funn: Faresignal[]
  kontrollertOk: Faresignal[]
}

interface Faresignal {
  kreverSupersaksbehandler: boolean
  beskrivelse: string
  kategori: string[]
}

export interface SpesialistOverstyring {
  hendelseId: string
  begrunnelse: string
  saksbehandlerNavn: string
  timestamp: string
  overstyrteDager: SpesialistOverstyringDag[]
}

export interface SpesialistOverstyringDag {
  dato: string
  dagtype: SpleisSykdomsdagtype
  grad?: number
}

export interface EksternUtbetalingshistorikkElement {
  beregningId: string
  beregnettidslinje: EksternSykdomsdag[]
  hendelsetidslinje: EksternSykdomsdag[]
  utbetaling: EksternUtbetaling
  tidsstempel: string
}

export interface EksternUtbetaling {
  status: string
  type: string
  utbetalingstidslinje: SpleisUtbetalingsdag[]
  maksdato: string
  gjenståendeSykedager: number
  arbeidsgiverNettoBeløp: number
  arbeidsgiverFagsystemId: string
  forbrukteSykedager: number
  vurdering?: EksternVurdering
}

export interface EksternVurdering {
  godkjent: boolean
  tidsstempel: string
  automatisk: boolean
  ident: string
}

export interface SpesialistArbeidsgiver {
  bransjer?: string[]
  id: string
  organisasjonsnummer: string
  vedtaksperioder: (SpesialistVedtaksperiode | UfullstendigSpesialistVedtaksperiode)[]
  navn: string
  overstyringer: SpesialistOverstyring[]
  utbetalingshistorikk?: EksternUtbetalingshistorikkElement[]
}

export interface SpleisDataForVilkårsvurdering {
  erEgenAnsatt: boolean
  beregnetÅrsinntektFraInntektskomponenten: number
  avviksprosent: number
  antallOpptjeningsdagerErMinst: number
  harOpptjening: boolean
  medlemskapstatus: SpleisMedlemskapstatus
}

export interface SpleisDataForSimulering {
  totalbeløp: number
  perioder: SpleisSimuleringperiode[]
}

export interface SpleisSimuleringperiode {
  fom: string
  tom: string
  utbetalinger: SpleisSimuleringutbetaling[]
}

export interface SpleisSimuleringutbetaling {
  detaljer: SpleisSimuleringutbetalingDetaljer[]
  feilkonto: boolean
  forfall: string
  utbetalesTilId: string
  utbetalesTilNavn: string
}

export interface SpleisSimuleringutbetalingDetaljer {
  antallSats: number
  beløp: number
  faktiskFom: string
  faktiskTom: string
  klassekode: string
  klassekodeBeskrivelse: string
  konto: string
  refunderesOrgNr: string
  sats: number
  tilbakeføring: boolean
  typeSats: string
  uføregrad: number
  utbetalingstype: string
}

// noinspection JSUnusedGlobalSymbols
export enum SpleisVedtaksperiodetilstand {
  TilUtbetaling = 'TilUtbetaling',
  Utbetalt = 'Utbetalt',
  Oppgaver = 'Oppgaver',
  Venter = 'Venter',
  VenterPåKiling = 'VenterPåKiling',
  IngenUtbetaling = 'IngenUtbetaling',
  Feilet = 'Feilet',
  TilInfotrygd = 'TilInfotrygd',
}

export interface SpleisVilkår {
  sykepengedager: SpleisSykepengedager
  alder: SpleisAlder
  opptjening: SpleisOpptjening
  søknadsfrist: SpleisSøknadsfrist
  sykepengegrunnlag: SpleisSykepengegrunnlag
  medlemskapstatus: SpleisMedlemskapstatus
}

export interface SpleisSykepengedager {
  forbrukteSykedager?: number
  skjæringstidspunkt: string
  førsteSykepengedag?: string
  maksdato?: string
  gjenståendeDager?: number
  oppfylt?: boolean
}

interface SpleisAlder {
  alderSisteSykedag: number
  oppfylt: boolean
}

interface SpleisOpptjening {
  antallKjenteOpptjeningsdager: number
  fom: string
  oppfylt: boolean
}

interface SpleisSøknadsfrist {
  sendtNav: string // date time
  søknadFom: string
  søknadTom: string
  oppfylt?: boolean
}

interface SpleisSykepengegrunnlag {
  sykepengegrunnlag?: number
  grunnbeløp: number
  oppfylt?: boolean
}

// noinspection JSUnusedGlobalSymbols
export enum SpleisMedlemskapstatus {
  JA = 'JA',
  NEI = 'NEI',
  VET_IKKE = 'VET_IKKE',
}

export type SpleisAlvorlighetsgrad = 'W'

export interface SpleisAktivitet {
  vedtaksperiodeId: string
  alvorlighetsgrad: SpleisAlvorlighetsgrad
  melding: string
  tidsstempel: string
}

export interface SpleisUtbetalinger {
  arbeidsgiverUtbetaling?: SpleisUtbetaling
  personUtbetaling?: SpleisUtbetaling
}

export interface SpleisUtbetaling {
  fagsystemId: string
  linjer: SpleisUtbetalingslinje[]
}

export interface SpesialistVedtaksperiode {
  id: string
  fom: string
  tom: string
  gruppeId: string
  tilstand: SpleisVedtaksperiodetilstand
  oppgavereferanse: string | null
  fullstendig: boolean
  erForkastet: boolean
  utbetalingsreferanse?: string
  utbetalingstidslinje: SpleisUtbetalingsdag[]
  utbetalinger: SpleisUtbetalinger
  sykdomstidslinje: EksternSykdomsdag[]
  automatiskBehandlet: boolean
  godkjentAv?: string
  godkjenttidspunkt?: string
  vilkår: SpleisVilkår
  inntektFraInntektsmelding?: number
  totalbeløpArbeidstaker: number
  dataForVilkårsvurdering: SpleisDataForVilkårsvurdering
  forlengelseFraInfotrygd: SpleisForlengelseFraInfotrygd
  periodetype: SpleisPeriodetype
  simuleringsdata?: SpleisDataForSimulering
  hendelser: SpleisHendelse[]
  utbetalingslinjer?: SpleisUtbetalingslinje[]
  aktivitetslogg: SpleisAktivitet[]
  risikovurdering: SpesialistRisikovurdering | null
  varsler: string[]
  beregningIder?: string[]
  inntektskilde: SpesialistInntektskilde
}

export interface UfullstendigSpesialistVedtaksperiode {
  id: string
  fom: string
  tom: string
  gruppeId: string
  tilstand: SpleisVedtaksperiodetilstand
  fullstendig: boolean
  utbetalingstidslinje?: SpleisUtbetalingsdag[]
}

export interface SpesialistInfotrygdutbetaling {
  fom: string
  tom: string
  grad: string
  dagsats: number
  typetekst: SpesialistInfotrygdtypetekst
  organisasjonsnummer: string
}

export enum SpesialistInfotrygdtypetekst {
  FERIE = 'Ferie',
  UTBETALING = 'Utbetaling',
  ARBEIDSGIVERREFUSJON = 'ArbRef',
  UKJENT = 'Ukjent..',
  TILBAKEFØRT = 'Tilbakeført',
}

export enum SpleisForlengelseFraInfotrygd {
  IKKE_ETTERSPURT = 'IKKE_ETTERSPURT',
  JA = 'JA',
  NEI = 'NEI',
}

export enum SpleisPeriodetype {
  FØRSTEGANGSBEHANDLING = 'FØRSTEGANGSBEHANDLING',
  FORLENGELSE = 'FORLENGELSE',
  INFOTRYGDFORLENGELSE = 'INFOTRYGDFORLENGELSE',
  OVERGANG_FRA_IT = 'OVERGANG_FRA_IT',
  STIKKPRØVE = 'STIKKPRØVE',
  RISK_QA = 'RISK_QA',
}

export enum SpesialistInntektskilde {
  EnArbeidsgiver = 'EN_ARBEIDSGIVER',
  FlereArbeidsgivere = 'FLERE_ARBEIDSGIVERE',
}

export interface SpesialistInntektsgrunnlag {
  skjæringstidspunkt: string
  sykepengegrunnlag?: number
  omregnetÅrsinntekt?: number
  sammenligningsgrunnlag?: number
  avviksprosent?: number
  maksUtbetalingPerDag?: number
  inntekter: SpesialistArbeidsgiverinntekt[]
  oppfyllerKravOmMinstelønn?: boolean
  grunnbeløp?: number
}

export interface SpesialistArbeidsgiverinntekt {
  arbeidsgiver: string
  omregnetÅrsinntekt?: SpesialistOmregnetÅrsinntekt
  sammenligningsgrunnlag?: SpesialistSammenligningsgrunnlag
}

export interface SpesialistOmregnetÅrsinntekt {
  kilde: SpesialistInntektkilde
  beløp: number
  månedsbeløp: number
  inntekterFraAOrdningen?: SpesialistInntekterFraAOrdningen[] //kun gyldig for A-ordningen
}

// noinspection JSUnusedGlobalSymbols
export enum SpesialistInntektkilde {
  Saksbehandler = 'Saksbehandler',
  Inntektsmelding = 'Inntektsmelding',
  Infotrygd = 'Infotrygd',
  AOrdningen = 'AOrdningen',
}

export interface SpesialistInntekterFraAOrdningen {
  måned: string
  sum: number
}

export interface SpesialistSammenligningsgrunnlag {
  beløp: number
  inntekterFraAOrdningen: SpesialistInntekterFraAOrdningen[]
}

export enum OpptegnelseType {
  UTBETALING_ANNULLERING_FEILET = 'UTBETALING_ANNULLERING_FEILET',
  UTBETALING_ANNULLERING_OK = 'UTBETALING_ANNULLERING_OK',
  NY_SAKSBEHANDLEROPPGAVE = 'NY_SAKSBEHANDLEROPPGAVE',
}

export interface Opptegnelse {
  aktørId: number
  sekvensnummer: number
  type: OpptegnelseType
  payload: string
}

export interface EksternBehandlingstatistikk {
  antallOppgaverTilGodkjenning: {
    totalt: number
    perPeriodetype: [{ periodetypeForSpeil: SpesialistPeriodetype; antall: number }]
  }
  antallTildelteOppgaver: {
    totalt: number
    perPeriodetype: [{ periodetypeForSpeil: SpesialistPeriodetype; antall: number }]
  }
  fullførteBehandlinger: {
    totalt: number
    manuelt: number
    automatisk: number
    annulleringer: number
  }
}

export interface Innsenderbehovsmelding {
  id: string
  type: BehovsmeldingType
  prioritet: Prioritet
  hjmBrukersFnr: string
  innsendingsdato: string
  bruker: Bruker
  brukersituasjon: Brukersituasjon
  hjelpemidler: Hjelpemidler
  levering: Levering
}

export enum BehovsmeldingType {
  SØKNAD = 'SØKNAD',
  BESTILLING = 'BESTILLING',
  BYTTE = 'BYTTE',
}

export interface Personnavn {
  fornavn: string
  etternavn: string
}

export enum Prioritet {
  NORMAL = 'NORMAL',
  HAST = 'HAST',
}

export enum Bruksarena {
  EGET_HJEM = 'EGET_HJEM',
  EGET_HJEM_IKKE_AVLASTNING = 'EGET_HJEM_IKKE_AVLASTNING',
  OMSORGSBOLIG_BOFELLESKAP_SERVICEBOLIG = 'OMSORGSBOLIG_BOFELLESKAP_SERVICEBOLIG',
  BARNEHAGE = 'BARNEHAGE',
  GRUNN_ELLER_VIDEREGÅENDESKOLE = 'GRUNN_ELLER_VIDEREGÅENDESKOLE',
  SKOLEFRITIDSORDNING = 'SKOLEFRITIDSORDNING',
  INSTITUSJON = 'INSTITUSJON',
  INSTITUSJON_BARNEBOLIG = 'INSTITUSJON_BARNEBOLIG',
  INSTITUSJON_BARNEBOLIG_KUN_PERSONLIG_BRUK = 'INSTITUSJON_BARNEBOLIG_KUN_PERSONLIG_BRUK',
}

export type Bytte = {
  hmsnr: string
  serienr: string | null
  hjmNavn: string
  hjmKategori: string
  årsak: BytteÅrsak | undefined
  erTilsvarende: boolean
}

export enum BytteÅrsak {
  'UTSLITT' = 'UTSLITT',
  'VOKST_FRA' = 'VOKST_FRA',
  'ENDRINGER_I_INNBYGGERS_FUNKSJON' = 'ENDRINGER_I_INNBYGGERS_FUNKSJON',
  'FEIL_STØRRELSE' = 'FEIL_STØRRELSE',
  'VURDERT_SOM_ØDELAGT_AV_LOKAL_TEKNIKER' = 'VURDERT_SOM_ØDELAGT_AV_LOKAL_TEKNIKER',
}

export interface Levering {
  hjelpemiddelformidler: Hjelpemiddelformidler
  oppfølgingsansvarlig: Oppfølgingsansvarlig
  annenOppfølgingsansvarlig: AnnenOppfølgingsansvarlig | undefined
  utleveringsmåte: Utleveringsmåte | undefined
  annenUtleveringsadresse: Veiadresse
  utleveringKontaktperson: Kontaktperson | undefined
  annenKontaktperson: AnnenKontaktperson | undefined
  utleveringMerknad: string | undefined
  hast: Hast | undefined
  automatiskUtledetTilleggsinfo: LeveringTilleggsinfo[]
}

export enum Oppfølgingsansvarlig {
  HJELPEMIDDELFORMIDLER = 'HJELPEMIDDELFORMIDLER',
  ANNEN_OPPFØLGINGSANSVARLIG = 'ANNEN_OPPFØLGINGSANSVARLIG',
}

export enum Kontaktperson {
  HJELPEMIDDELBRUKER = 'HJELPEMIDDELBRUKER',
  HJELPEMIDDELFORMIDLER = 'HJELPEMIDDELFORMIDLER',
  ANNEN_KONTAKTPERSON = 'ANNEN_KONTAKTPERSON',
}

export interface Hjelpemiddelformidler {
  navn: Personnavn
  arbeidssted: string
  stilling: string
  telefon: string
  adresse: Veiadresse
  epost: string
  treffesEnklest: string
}

export enum Utleveringsmåte {
  FOLKEREGISTRERT_ADRESSE = 'FOLKEREGISTRERT_ADRESSE',
  ANNEN_BRUKSADRESSE = 'ANNEN_BRUKSADRESSE',
  HJELPEMIDDELSENTRALEN = 'HJELPEMIDDELSENTRALEN',
  ALLEREDE_UTLEVERT_AV_NAV = 'ALLEREDE_UTLEVERT_AV_NAV',
}

export interface AnnenOppfølgingsansvarlig {
  navn: Personnavn
  arbeidssted: string
  stilling: string
  telefon: string
  ansvarFor: string
}

export interface AnnenKontaktperson {
  navn: Personnavn
  telefon: string
}

export enum LeveringTilleggsinfo {
  UTLEVERING_KALENDERAPP = 'UTLEVERING_KALENDERAPP',
  ALLE_HJELPEMIDLER_ER_UTLEVERT = 'ALLE_HJELPEMIDLER_ER_UTLEVERT',
}

export interface Veiadresse {
  adresse: string
  postnummer: string
  poststed: string
}

export interface Hast {
  hasteårsaker: Hasteårsak[]
  hastBegrunnelse: string | null
}

export enum Hasteårsak {
  'UTVIKLING_AV_TRYKKSÅR' = 'UTVIKLING_AV_TRYKKSÅR',
  'TERMINALPLEIE' = 'TERMINALPLEIE',
  'UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES' = 'UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES',
  'UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES_V2' = 'UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES_V2',
  'UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES_V3' = 'UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES_V3',
  'RASK_FORVERRING_AV_ALVORLIG_DIAGNOSE' = 'RASK_FORVERRING_AV_ALVORLIG_DIAGNOSE',
  'ANNET' = 'ANNET',
}

export interface Bruker {
  fnr: string
  navn: Personnavn
  signaturtype: Signaturtype
  telefon: string
  veiadresse: Veiadresse | undefined
  kommunenummer: string | undefined
  brukernummer: string | undefined
  kilde: Brukerkilde | undefined
  legacyopplysninger: EnkelOpplysning[]
}

export enum Signaturtype {
  BRUKER_BEKREFTER = 'BRUKER_BEKREFTER',
  FULLMAKT = 'FULLMAKT',
  FRITAK_FRA_FULLMAKT = 'FRITAK_FRA_FULLMAKT',
  IKKE_INNHENTET_FORDI_BYTTE = 'IKKE_INNHENTET_FORDI_BYTTE',
  IKKE_INNHENTET_FORDI_BRUKERPASSBYTTE = 'IKKE_INNHENTET_FORDI_BRUKERPASSBYTTE',
  IKKE_INNHENTET_FORDI_KUN_TILBEHØR = 'IKKE_INNHENTET_FORDI_KUN_TILBEHØR',
  IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V2 = 'IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V2', // Med bekreftelse fra formidler om at innbygger er kjent med at tilbehøret meldes behov om
  IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V3 = 'IKKE_INNHENTET_FORDI_KUN_TILBEHØR_V3',
}

export enum Brukerkilde {
  PDL = 'PDL',
  FORMIDLER = 'FORMIDLER',
}

export interface Brukersituasjon {
  bekreftedeVilkår: BrukersituasjonVilkår[]
  vilkår: Vilkår[]
  funksjonsnedsettelser: Funksjonsnedsettelse[]
  funksjonsbeskrivelse: Funksjonsbeskrivelse | null
}

export interface Funksjonsbeskrivelse {
  innbyggersVarigeFunksjonsnedsettelse: InnbyggersVarigeFunksjonsnedsettelse
  diagnose: string | null
  beskrivelse: string
}

export enum InnbyggersVarigeFunksjonsnedsettelse {
  ALDERDOMSSVEKKELSE = 'ALDERDOMSSVEKKELSE',
  ANNEN_VARIG_DIAGNOSE = 'ANNEN_VARIG_DIAGNOSE',
  UAVKLART = 'UAVKLART',
}

enum Funksjonsnedsettelse {
  BEVEGELSE = 'BEVEGELSE',
  HØRSEL = 'HØRSEL',
  KOGNISJON = 'KOGNISJON',
  SYN = 'SYN',
  KOMMUNIKASJON = 'KOMMUNIKASJON',
}

export enum BrukersituasjonVilkår {
  NEDSATT_FUNKSJON = 'NEDSATT_FUNKSJON',
  STØRRE_BEHOV = 'STØRRE_BEHOV',
  PRAKTISKE_PROBLEM = 'PRAKTISKE_PROBLEM',
  PRAKTISKE_PROBLEMER_I_DAGLIGLIVET_V1 = 'PRAKTISKE_PROBLEMER_I_DAGLIGLIVET_V1',
  VESENTLIG_OG_VARIG_NEDSATT_FUNKSJONSEVNE_V1 = 'VESENTLIG_OG_VARIG_NEDSATT_FUNKSJONSEVNE_V1',
  KAN_IKKE_LØSES_MED_ENKLERE_HJELPEMIDLER_V1 = 'KAN_IKKE_LØSES_MED_ENKLERE_HJELPEMIDLER_V1',
  I_STAND_TIL_Å_BRUKE_HJELPEMIDLENE_V1 = 'I_STAND_TIL_Å_BRUKE_HJELPEMIDLENE_V1',
}

export interface Vilkår {
  vilkårtype: BrukersituasjonVilkår
  tekst: LokalisertTekst
}

export interface Hjelpemidler {
  hjelpemidler: Hjelpemiddel[]
  tilbehør: Tilbehør[]
  totaltAntall: number
}

export interface Hjelpemiddel {
  hjelpemiddelId: string
  antall: number
  produkt: HjelpemiddelProdukt
  tilbehør: Tilbehør[]
  bytter: Bytte[]
  bruksarenaer: Bruksarena[]
  utlevertinfo: Utlevertinfo
  opplysninger: Opplysning[]
  varsler: Varsel[]
  saksbehandlingvarsel?: Varsel[]
}

export interface HjelpemiddelProdukt {
  hmsArtNr: string
  artikkelnavn: string
  iso8: string
  iso8Tittel: string
  rangering: number | undefined
  delkontrakttittel: string
  sortimentkategori: string // fra digithot-sortiment
}

export interface Tilbehør {
  hmsArtNr: string
  navn: string
  antall: number
  opplysninger?: Opplysning[]
  begrunnelse: string | undefined
  fritakFraBegrunnelseÅrsak: FritakFraBegrunnelseÅrsak | undefined
  saksbehandlingvarsel?: Varsel[]
}

export enum FritakFraBegrunnelseÅrsak {
  ER_PÅ_BESTILLINGSORDNING = 'ER_PÅ_BESTILLINGSORDNING',
  ER_SELVFORKLARENDE_TILBEHØR = 'ER_SELVFORKLARENDE_TILBEHØR',
  IKKE_I_PILOT = 'IKKE_I_PILOT',
}

export interface Utlevertinfo {
  alleredeUtlevertFraHjelpemiddelsentralen: boolean
  utleverttype: UtlevertType | undefined
  overførtFraBruker: string | undefined
  annenKommentar: string | undefined
}

export enum UtlevertType {
  FREMSKUTT_LAGER = 'FREMSKUTT_LAGER',
  KORTTIDSLÅN = 'KORTTIDSLÅN',
  OVERFØRT = 'OVERFØRT',
  ANNET = 'ANNET',
}

export interface Opplysning {
  ledetekst: LokalisertTekst
  innhold: Tekst[]
}

export interface EnkelOpplysning {
  ledetekst: LokalisertTekst
  innhold: LokalisertTekst
}

export interface Varsel {
  tekst: LokalisertTekst
  type: Varseltype
}

export enum Varseltype {
  INFO = 'INFO',
  WARNING = 'WARNING',
}

export interface LokalisertTekst {
  nb: string
  nn: string
}

export interface Tekst {
  fritekst?: string
  forhåndsdefinertTekst?: LokalisertTekst
  begrepsforklaring?: LokalisertTekst
}

import type { KodeverkGjelder, OppgaveKodeverk } from '../../oppgave/oppgaveTypes.ts'
import type { SetRequired } from 'type-fest'

export class KodeverkStore {
  gjelder(behandlingstypeKode?: string): ReadonlyArray<KodeverkGjelder> {
    if (behandlingstypeKode) {
      return KodeverkStore.gjelder.filter((g) => g.behandlingstype?.kode === behandlingstypeKode)
    }
    return KodeverkStore.gjelder
  }

  behandlingstyper(): ReadonlyArray<OppgaveKodeverk> {
    return KodeverkStore.behandlingstype
  }

  finnBehandlingstema(behandlingstemaKode: string) {
    return KodeverkStore.gjelder.filter(harBehandlingstemaKode(behandlingstemaKode))
  }

  finnBehandlingstype(behandlingstypeKode: string) {
    return KodeverkStore.gjelder.filter(harBehandlingstypeKode(behandlingstypeKode))
  }

  oppgavetype(): ReadonlyArray<OppgaveKodeverk> {
    return KodeverkStore.oppgavetype
  }

  dokumenttitler(): ReadonlyArray<string> {
    return KodeverkStore.dokumenttitler
  }

  static readonly dokumenttitler: ReadonlyArray<string> = [
    'Arbeidsforhold',
    'Bestilling av hjelpemidler',
    'Bytte av hjelpemiddel',
    'Dokumentasjon av arbeid eller utdanning',
    'Fullmakt',
    'Henvisning generell',
    'Hjelp til vurdering og utprøving av forflytningshjelpemidler',
    'Hjelp til vurdering og utprøving av hjelpemidler til trening, aktivitet og stimulering',
    'Hjelp til vurdering og utprøving av hørselshjelpemidler',
    'Hjelp til vurdering og utprøving av ikt-hjelpemidler',
    'Hjelp til vurdering og utprøving av kognisjonshjelpemidler',
    'Hjelp til vurdering og utprøving av kommunikasjonshjelpemidler',
    'Hjelp til vurdering og utprøving av motorkjøretøy eller annet transportmiddel',
    'Hjelp til vurdering og utprøving av synshjelpemidler',
    'Klage/anke',
    'Medisinsk dokumentasjon',
    'Pristilbud',
    'Søknad om forflytningshjelpemidler',
    'Søknad om hjelpemidler',
    'Søknad om høreapparat',
    'Søknad om hørselshjelpemidler',
    'Søknad om ikt-hjelpemidler',
    'Søknad om kognisjonshjelpemidler',
    'Søknad om kommunikasjonshjelpemidler',
    'Søknad om servicehund',
    'Søknad om stønad til arbeids- og utdanningsreiser',
    'Søknad om synshjelpemidler',
    'Søknad om teknisk bistand',
    'Søknad om tilpasningskurs for syns- og hørselshemmede',
    'Søknad om tolk til døve, hørselshemmede og døvblinde',
    'Tilleggsskjema for arbeidslogg for utprøving av Innowalk',
    'Tilleggsskjema for elektrisk rullestol',
    'Tilleggsskjema for hev- og senkbare kjøkkenløsninger',
    'Tilleggsskjema for hjelpemiddel til trening, stimulering og aktivisering',
    'Tilleggsskjema for hjelpemidler og tilrettelegging i arbeidslivet',
    'Tilleggsskjema for hjelpemidler på bad',
    'Tilleggsskjema for hørselshjelpemiddel',
    'Tilleggsskjema for kognitivt hjelpemiddel',
    'Tilleggsskjema for kommunikasjonshjelpemiddel',
    'Tilleggsskjema for manuell rullestol',
    'Tilleggsskjema for omgivelseskontroll',
    'Tilleggsskjema for stasjonær personløfter',
    'Tilleggsskjema for stol med oppreisningsfunksjon',
    'Tilleggsskjema for synshjelpemiddel',
    'Uttalelse fra fagperson i saken',
    'Vedtak om hjelpemidler',
  ]

  static readonly behandlingstype: ReadonlyArray<OppgaveKodeverk> = [
    { kode: 'ae0287', term: 'Aktivitetshjelpemidler/AKT26' },
    { kode: 'ae0046', term: 'Anke' },
    { kode: 'ae0276', term: 'Arbeidsliv' },
    { kode: 'ae0223', term: 'Barn' },
    { kode: 'ae0004', term: 'Behandle vedtak' },
    { kode: 'ae0281', term: 'Bestilling' },
    { kode: 'ae0277', term: 'Bolig' },
    { kode: 'ae0285', term: 'Bytte' },
    { kode: 'ae0278', term: 'Dagligliv' },
    { kode: 'ae0227', term: 'Digital søknad' },
    { kode: 'ae0273', term: 'Digitalt bytte' },
    { kode: 'ae0288', term: 'Ettersendelse' },
    { kode: 'ae0282', term: 'Hastebestilling' },
    { kode: 'ae0283', term: 'Hastebytte' },
    { kode: 'ae0286', term: 'Hastesøknad' },
    { kode: 'ae0289', term: 'Hjelp til utprøving' },
    { kode: 'ae0058', term: 'Klage' },
    { kode: 'ae0224', term: 'Partsinnsyn' },
    { kode: 'ae0034', term: 'Søknad' },
    { kode: 'ae0291', term: 'Tilbehør' },
    { kode: 'ae0275', term: 'Utdanning' },
    { kode: 'ae0106', term: 'Utland' },
  ]

  static readonly behandlingstema: ReadonlyArray<KodeverkGjelder> = [
    { behandlingstema: null, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    {
      behandlingstema: { kode: 'ab0215', term: 'Ombygging /tilrettelegging arbeid' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0245', term: 'Lese- og sekretærhjelp' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0317', term: 'Briller/linser' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0370', term: 'Varsling og alarm' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    { behandlingstema: { kode: 'ab0372', term: 'Kognisjon' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    { behandlingstema: { kode: 'ab0373', term: 'IT' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    { behandlingstema: { kode: 'ab0376', term: 'Hørsel' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    { behandlingstema: { kode: 'ab0377', term: 'Syn' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    { behandlingstema: { kode: 'ab0378', term: 'Henvisning' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    {
      behandlingstema: { kode: 'ab0420', term: 'Briller til barn' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0427', term: 'Behandlingsbriller/linser ordinære vilkår' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0428', term: 'Behandlingsbriller/linser særskilte vilkår' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    { behandlingstema: { kode: 'ab0429', term: 'Irislinser' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    {
      behandlingstema: { kode: 'ab0443', term: 'Regning lese- og sekretærhjelp' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0464', term: 'Kommunikasjon' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0523', term: 'Filterbriller' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0535', term: 'Kalendere og planleggingsverktøy' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    { behandlingstema: { kode: 'ab0536', term: 'Bevegelse' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    {
      behandlingstema: { kode: 'ab0537', term: 'Arbeidsstoler, sittemøbler og bord' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0538', term: 'Innredning kjøkken og bad' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0539', term: 'Elektrisk rullestol' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0540', term: 'Overflytting, vending og posisjonering' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0541', term: 'Kjørepose og regncape' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    { behandlingstema: { kode: 'ab0542', term: 'Kjørerampe' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    {
      behandlingstema: { kode: 'ab0543', term: 'Trappeheis og løfteplattform' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0544', term: 'Sittesystem' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0545', term: 'Manuell rullestol' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0546', term: 'Omgivelseskontroll' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0547', term: 'Madrasser trykksårforebyggende' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    { behandlingstema: { kode: 'ab0548', term: 'Seng' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    {
      behandlingstema: { kode: 'ab0549', term: 'Stol med oppreisning' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0550', term: 'Ganghjelpemiddel' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    { behandlingstema: { kode: 'ab0551', term: 'Ståstativ' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    {
      behandlingstema: { kode: 'ab0552', term: 'Personløfter og løftesete' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0553', term: 'Varmehjelpemiddel' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0554', term: 'Vogn og sportsutstyr' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    { behandlingstema: { kode: 'ab0555', term: 'Sittepute' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    { behandlingstema: { kode: 'ab0556', term: 'Sykkel' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    {
      behandlingstema: { kode: 'ab0557', term: 'Tilskudd PC' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0558', term: 'Sansestimulering' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0559', term: 'Tilskudd småhjelpemidler' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    {
      behandlingstema: { kode: 'ab0560', term: 'Tilskudd apper' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
    { behandlingstema: { kode: 'ab0561', term: 'Tilskudd' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    { behandlingstema: { kode: 'ab0562', term: 'Hygiene' }, behandlingstype: { kode: 'ae0278', term: 'Dagligliv' } },
    {
      behandlingstema: { kode: 'ab0566', term: 'Lese- og skrivestøtte' },
      behandlingstype: { kode: 'ae0278', term: 'Dagligliv' },
    },
  ]

  static readonly gjelder: ReadonlyArray<KodeverkGjelder> = [
    {
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0215',
        term: 'Ombygging /tilrettelegging arbeid',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0245',
        term: 'Lese- og sekretærhjelp',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0317',
        term: 'Briller/linser',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0370',
        term: 'Varsling og alarm',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0372',
        term: 'Kognisjon',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0373',
        term: 'IT',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0376',
        term: 'Hørsel',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0377',
        term: 'Syn',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0378',
        term: 'Henvisning',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0420',
        term: 'Briller til barn',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0427',
        term: 'Behandlingsbriller/linser ordinære vilkår',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0428',
        term: 'Behandlingsbriller/linser særskilte vilkår',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0429',
        term: 'Irislinser',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0443',
        term: 'Regning lese- og sekretærhjelp',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0464',
        term: 'Kommunikasjon',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0523',
        term: 'Filterbriller',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0535',
        term: 'Kalendere og planleggingsverktøy',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0536',
        term: 'Bevegelse',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0537',
        term: 'Arbeidsstoler, sittemøbler og bord',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0538',
        term: 'Innredning kjøkken og bad',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0539',
        term: 'Elektrisk rullestol',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0540',
        term: 'Overflytting, vending og posisjonering',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0541',
        term: 'Kjørepose og regncape',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0542',
        term: 'Kjørerampe',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0543',
        term: 'Trappeheis og løfteplattform',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0544',
        term: 'Sittesystem',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0545',
        term: 'Manuell rullestol',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0546',
        term: 'Omgivelseskontroll',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0547',
        term: 'Madrasser trykksårforebyggende',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0548',
        term: 'Seng',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0549',
        term: 'Stol med oppreisning',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0550',
        term: 'Ganghjelpemiddel',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0551',
        term: 'Ståstativ',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0552',
        term: 'Personløfter og løftesete',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0553',
        term: 'Varmehjelpemiddel',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0554',
        term: 'Vogn og sportsutstyr',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0555',
        term: 'Sittepute',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0556',
        term: 'Sykkel',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0557',
        term: 'Tilskudd PC',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0558',
        term: 'Sansestimulering',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0559',
        term: 'Tilskudd småhjelpemidler',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0560',
        term: 'Tilskudd apper',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0561',
        term: 'Tilskudd',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0562',
        term: 'Hygiene',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
    {
      behandlingstema: {
        kode: 'ab0566',
        term: 'Lese- og skrivestøtte',
      },
      behandlingstype: {
        kode: 'ae0227',
        term: 'Digital søknad',
      },
    },
  ]

  static readonly oppgavetype: ReadonlyArray<OppgaveKodeverk> = [
    {
      kode: 'BEH_SED',
      term: 'Behandle SED',
    },
    {
      kode: 'VURD_NOTAT',
      term: 'Vurder notat',
    },
    {
      kode: 'VURD_BREV',
      term: 'Vurder brev',
    },
    {
      kode: 'ROB_BEH',
      term: 'Robotbehandling',
    },
    {
      kode: 'BEH_SAK',
      term: 'Behandle sak',
    },
    {
      kode: 'BEH_SAK_MK',
      term: 'Behandle sak (Manuell)',
    },
    {
      kode: 'FLY',
      term: 'Flyttesak',
    },
    {
      kode: 'INNH_DOK',
      term: 'Innhent dokumentasjon',
    },
    {
      kode: 'JFR',
      term: 'Journalføring',
    },
    {
      kode: 'FDR',
      term: 'Fordeling',
    },
    {
      kode: 'KON_UTG_SCA_DOK',
      term: 'Kontroller utgående skannet dokument',
    },
    {
      kode: 'KONT_BRUK',
      term: 'Kontakt bruker',
    },
    {
      kode: 'MOTK',
      term: 'Krav mottatt',
    },
    {
      kode: 'RETUR',
      term: 'Behandle returpost',
    },
    {
      kode: 'SVAR_IK_MOT',
      term: 'Svar ikke mottatt',
    },
    {
      kode: 'VUR',
      term: 'Vurder dokument',
    },
    {
      kode: 'VUR_KONS_YTE',
      term: 'Vurder konsekvens for ytelse',
    },
    {
      kode: 'VUR_SVAR',
      term: 'Vurder svar',
    },
    {
      kode: 'VURD_HENV',
      term: 'Vurder henvendelse',
    },
    {
      kode: 'BEH_UND_VED',
      term: 'Behandle underkjent vedtak',
    },
    {
      kode: 'GOD_VED',
      term: 'Godkjenne vedtak',
    },
    {
      kode: 'HJELP_UTPROV',
      term: 'Hjelp til utprøving',
    },
  ]
}

function harBehandlingstemaKode(behandlingstemaKode: string) {
  return (gjelder: KodeverkGjelder): gjelder is SetRequired<KodeverkGjelder, 'behandlingstema'> =>
    gjelder.behandlingstema?.kode === behandlingstemaKode
}

function harBehandlingstypeKode(behandlingstypeKode: string) {
  return (gjelder: KodeverkGjelder): gjelder is SetRequired<KodeverkGjelder, 'behandlingstype'> =>
    gjelder.behandlingstype?.kode === behandlingstypeKode
}

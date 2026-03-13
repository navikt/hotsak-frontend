import type { KodeverkGjelder, OppgaveKodeverk } from '../../oppgave/oppgaveTypes.ts'
import type { SetRequired } from 'type-fest'

export class KodeverkStore {
  gjelder(): ReadonlyArray<KodeverkGjelder> {
    return KodeverkStore.gjelder
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

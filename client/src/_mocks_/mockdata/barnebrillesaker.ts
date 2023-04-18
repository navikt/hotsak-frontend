import dayjs from 'dayjs'

import {
  Brillesak,
  MålformType,
  Oppgave,
  OppgaveStatusType,
  Oppgavetype,
  SatsType,
  StegType,
  Vilkårsgrunnlag,
  VilkårsResultat,
  VilkårSvar,
  Vilkårsvurdering,
} from '../../types/types.internal'
import { enheter } from './enheter'
import { groupBy, lagTilfeldigFødselsdato, nextId } from './felles'
import { lagTilfeldigFødselsnummer } from './fødselsnumre'
import { journalposter } from './journalposter'

const nå = dayjs()
const bestillingsdato = nå.subtract(10, 'days')

function lagVilkårsgrunnlag(): Vilkårsgrunnlag {
  return {
    målform: MålformType.BOKMÅL,
    brilleseddel: {
      høyreSfære: '2.5',
      høyreSylinder: '6',
      venstreSfære: '3',
      venstreSylinder: '4.5',
    },
    bestillingsdato: bestillingsdato.toDate(),
    brillepris: '1200',
    bestiltHosOptiker: { vilkårOppfylt: VilkårSvar.JA },
    komplettBrille: {
      vilkårOppfylt: VilkårSvar.JA,
    },
  }
}

function lagVilkårsvurdering(sakId: string | number): Vilkårsvurdering {
  return {
    id: nextId().toString(),
    sakId: sakId.toString(),
    opprettet: nå.toISOString(),
    resultat: VilkårsResultat.JA,
    sats: SatsType.SATS_3,
    satsBeløp: '2650',
    satsBeskrivelse:
      'Briller med sfærisk styrke på minst ett glass ≥ 6,25D ≤ 8,00D og/eller cylinderstyrke ≥ 4,25D ≤ 6,00D',
    beløp: '2000',
    vilkår: [
      {
        id: nextId().toString(),
        identifikator: 'Under18ÅrPåBestillingsdato v1',
        beskrivelse: 'Var barnet under 18 år på bestillingsdato?',
        lovReferanse: '§2',
        lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
        resultatAuto: VilkårsResultat.JA,
        begrunnelseAuto: 'Barnet var 18 år eller eldre på bestillingsdato',
        grunnlag: {
          barnetsAlder: '12',
          bestillingsdato: bestillingsdato.toISODateString(),
        },
      },
      {
        id: nextId().toString(),
        identifikator: 'MedlemAvFolketrygden v1',
        beskrivelse: 'Er barnet medlem av folketrygden?',
        lovReferanse: '§2',
        lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
        resultatAuto: VilkårsResultat.JA,
        begrunnelseAuto: 'Barnet er antatt medlem i folketrygden basert på folkeregistrert adresse i Norge',
        grunnlag: {
          bestillingsdato: bestillingsdato.toISODateString(),
        },
      },
      {
        id: nextId().toString(),
        identifikator: 'bestiltHosOptiker',
        beskrivelse: 'Brille er bestilt hos optiker',
        lovReferanse: '§2',
        lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
        resultatSaksbehandler: VilkårsResultat.JA,
        begrunnelseSaksbehandler: '',
        grunnlag: {},
      },
      {
        id: nextId().toString(),
        identifikator: 'komplettBrille',
        beskrivelse: 'Brille må være komplett',
        lovReferanse: '§2',
        lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
        resultatSaksbehandler: VilkårsResultat.JA,
        begrunnelseSaksbehandler: '',
        grunnlag: {},
      },
      {
        id: nextId().toString(),
        identifikator: 'HarIkkeVedtakIKalenderåret v1',
        beskrivelse: 'Har barnet allerede vedtak om brille i kalenderåret?',
        lovReferanse: '§3',
        lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§3',
        resultatAuto: VilkårsResultat.JA,
        begrunnelseAuto: 'Barnet har ikke vedtak om brille i kalenderåret',
        grunnlag: {
          bestillingsdato: bestillingsdato.toISODateString(),
        },
      },
      {
        id: nextId().toString(),
        identifikator: 'HarIkkeVedtakIKalenderåret v1',
        beskrivelse: 'Har barnet allerede manuelt Hotsak-vedtak om brille i kalenderåret?',
        lovReferanse: '§3',
        lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§3',
        resultatAuto: VilkårsResultat.JA,
        begrunnelseAuto: 'Barnet har ikke vedtak om brille i kalenderåret',
        resultatSaksbehandler: VilkårsResultat.JA,
        begrunnelseSaksbehandler:
          'Her har det vært noe tull med andre saker så dato stemmer ikke. Overprøver dette vilkåret basert på informasjon i vedlegg til søknaden.',
        grunnlag: {},
      },
      {
        id: nextId().toString(),
        identifikator: 'Brillestyrke v1',
        beskrivelse: 'Er brillestyrken innenfor de fastsatte rammene?',
        lovReferanse: '§4',
        lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§4',
        resultatAuto: VilkårsResultat.JA,
        begrunnelseAuto: 'Høyre sfære oppfyller vilkår om brillestyrke ≥ 1.0',
        grunnlag: {},
      },
      {
        id: nextId().toString(),
        identifikator: 'BestillingsdatoTilbakeITid v1',
        beskrivelse: 'Er bestillingsdato innenfor siste 6 måneder fra dagens dato?',
        lovReferanse: '§6',
        lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§6',
        resultatAuto: VilkårsResultat.JA,
        begrunnelseAuto: 'Bestillingsdato er 17.08.2022 eller senere',
        grunnlag: {
          bestillingsdato: bestillingsdato.toISODateString(),
          seksMånederSiden: nå.subtract(6, 'months').toISOString(),
        },
      },
      {
        id: nextId().toString(),
        identifikator: 'Bestillingsdato v1',
        beskrivelse: 'Er bestillingsdato 01.08.2022 eller senere?',
        lovReferanse: '§13',
        lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§13',
        resultatAuto: VilkårsResultat.JA,
        begrunnelseAuto: 'Bestillingsdato er 01.08.2022 eller senere',
        grunnlag: {
          bestillingsdato: bestillingsdato.toISODateString(),
          datoOrdningenStartet: '2022-08-01',
        },
      },
    ],
  }
}

export function lagBarnebrillesak(sakId: string | number = nextId()): Brillesak {
  const fødselsdatoBruker = lagTilfeldigFødselsdato(10)
  return {
    saksinformasjon: {
      opprettet: nå.toISOString(),
    },
    sakId: sakId.toString(),
    sakstype: Oppgavetype.BARNEBRILLER,
    soknadGjelder: 'Barnebriller',
    bruker: {
      fnr: lagTilfeldigFødselsnummer(fødselsdatoBruker),
      fødselsdato: fødselsdatoBruker.toISODateString(),
      kontonummer: '11111111113',
      navn: {
        fornavn: 'Banal',
        etternavn: 'Blomst',
      },
      telefon: '10203040',
    },
    innsender: {
      fnr: lagTilfeldigFødselsnummer(42),
      navn: 'Sjenert Sjøstjerne',
    },
    vilkårsgrunnlag: lagVilkårsgrunnlag(),
    vilkårsvurdering: lagVilkårsvurdering(sakId),
    status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
    statusEndret: nå.toISOString(),

    steg: StegType.INNHENTE_FAKTA,
    enhet: enheter.oslo,
    saksbehandler: undefined,
    totrinnskontroll: undefined,
    journalposter: [journalposter[0].journalpostID],
  }
}

export const barnebrillesaker: Brillesak[] = [
  lagBarnebrillesak(),
  lagBarnebrillesak(),
  lagBarnebrillesak(),
  lagBarnebrillesak(),
  lagBarnebrillesak(),
]

export const barnebrillesakerBySakId: Record<string, Brillesak> = groupBy(barnebrillesaker, ({ sakId }) => sakId)

export const barnebrilleoppgaver: Oppgave[] = barnebrillesaker.map<Oppgave>((sak) => ({
  saksid: sak.sakId,
  sakstype: Oppgavetype.TILSKUDD,
  status: sak.status,
  statusEndret: sak.statusEndret,
  beskrivelse: sak.soknadGjelder,
  mottatt: sak.saksinformasjon.opprettet,
  innsender: sak.innsender.navn,
  bruker: {
    fnr: sak.bruker.fnr,
    fornavn: sak.bruker.navn.fornavn,
    mellomnavn: sak.bruker.navn.mellomnavn,
    etternavn: sak.bruker.navn.etternavn,
    funksjonsnedsettelser: ['syn'],
    bosted: 'Svarga',
  },
  enhet: sak.enhet,
  saksbehandler: sak.saksbehandler,
  kanTildeles: true,
}))

function Barnebriller() {
  const barnebrillesaker: Brillesak[] = [
    lagBarnebrillesak(),
    lagBarnebrillesak(),
    lagBarnebrillesak(),
    lagBarnebrillesak(),
    lagBarnebrillesak(),
  ]
  const barnebrillesakerBySakId: Record<string, Brillesak> = groupBy(barnebrillesaker, ({ sakId }) => sakId)
  return {
    hent(sakId: string): Brillesak | undefined {
      return barnebrillesakerBySakId[sakId]
    },
    tildel(sakId: string, saksbehandlerId: string): void {
      return
    },
  }
}

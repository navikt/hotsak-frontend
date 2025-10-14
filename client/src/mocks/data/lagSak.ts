import {
  Barnebrillesak,
  Bruker,
  GreitÅViteType,
  Hendelse,
  Kjønn,
  OppgaveStatusType,
  Sak,
  Sakstype,
  StegType,
  Vilkår,
  Vilkårsgrunnlag,
  VilkårsResultat,
  Vilkårsvurdering,
  VurderVilkårRequest,
} from '../../types/types.internal.ts'
import { beregnSats } from './beregnSats.ts'
import { vurderteVilkår } from './vurderteVilkår.ts'
import {
  lagTilfeldigDato,
  lagTilfeldigFødselsdato,
  lagTilfeldigInteger,
  lagTilfeldigTelefonnummer,
  nåIso,
} from './felles.ts'
import { lagTilfeldigFødselsnummer } from './fødselsnummer.ts'
import { lagTilfeldigNavn } from './navn.ts'
import { formatISO } from 'date-fns'
import { lagTilfeldigBosted } from './bosted.ts'
import { enheter } from './enheter.ts'
import { formaterNavn } from '../../utils/formater.ts'

export type LagretSak = LagretHjelpemiddelsak | LagretBarnebrillesak
export type InsertSak = InsertHjelpemiddelsak | InsertBarnebrillesak

export function erLagretHjelpemiddelsak(sak?: LagretSak | null): sak is LagretHjelpemiddelsak {
  return sak != null && sak.sakstype !== Sakstype.BARNEBRILLER
}

export function erInsertHjelpemiddelsak(sak?: InsertSak | null): sak is InsertHjelpemiddelsak {
  return sak != null && sak.sakstype !== Sakstype.BARNEBRILLER
}

export function erLagretBarnebrillesak(sak?: LagretSak | null): sak is LagretBarnebrillesak {
  return sak != null && sak.sakstype === Sakstype.BARNEBRILLER
}

export function erInsertBarnebrillesak(sak?: InsertSak | null): sak is InsertBarnebrillesak {
  return sak != null && sak.sakstype === Sakstype.BARNEBRILLER
}

export type LagretHjelpemiddelsak = Sak
export type InsertHjelpemiddelsak = Omit<LagretHjelpemiddelsak, 'sakId'>

export function lagHjelpemiddelsak(
  sakstype: Sakstype.BESTILLING | Sakstype.SØKNAD = Sakstype.SØKNAD,
  overstyringer: {
    bruker?: Partial<Bruker>
  } = {}
): InsertHjelpemiddelsak {
  const bruker = lagBruker(overstyringer.bruker)
  const opprettet = lagTilfeldigDato(new Date().getFullYear())

  return {
    ...bruker,
    opprettet: opprettet.toISOString(),
    sakstype,
    søknadGjelder: 'Søknad om: terskeleliminator, rullator',
    innsender: {
      fnr: lagTilfeldigFødselsnummer(32),
      navn: lagTilfeldigNavn().fulltNavn,
      adressebeskyttelseOgSkjerming: {
        gradering: [],
        skjermet: false,
      },
    },
    greitÅViteFaktum: [
      // fixme -> tilby som overstyring
      /*
      {
        beskrivelse:
          'Bruker bor på institusjon (sykehjem), ifølge formidler. Du må sjekke om vilkårene for institusjon er oppfylt.',
        type: GreitÅViteType.ADVARSEL,
      },
      */
      {
        beskrivelse: 'Personalia fra Folkeregisteret',
        type: GreitÅViteType.INFO,
      },
    ],
    status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    statusEndret: opprettet.toISOString(),
    enhet: enheter.oslo,

    // fixme -> tilby som overstyring
    /*
    hast: (() => {
      return {
        årsaker: [Hasteårsak.ANNET],
        begrunnelse: 'Det haster veldig!',
      }
    })(),
    */
  }
}

export type LagretVilkårsgrunnlag = Vilkårsgrunnlag

export function lagVilkårsgrunnlag(sakId: string, vurderVilkårRequest: VurderVilkårRequest): LagretVilkårsgrunnlag {
  return {
    data: { ...vurderVilkårRequest.data },
    sakId,
    sakstype: vurderVilkårRequest.sakstype,
    målform: vurderVilkårRequest.målform,
  }
}

export type LagretVilkårsvurdering = Omit<Vilkårsvurdering, 'vilkår'>

export function lagVilkårsvurdering(sakId: string, vurderVilkårRequest: VurderVilkårRequest): LagretVilkårsvurdering {
  if (vurderVilkårRequest.data) {
    const { brillepris, brilleseddel } = vurderVilkårRequest.data
    const { sats, satsBeløp, satsBeskrivelse, beløp } = beregnSats(brilleseddel, brillepris)

    return {
      id: sakId,
      sakId,
      resultat: VilkårsResultat.JA,
      data: {
        sats,
        satsBeløp,
        satsBeskrivelse,
        beløp,
      },
      opprettet: nåIso(),
    }
  } else {
    throw new Error('Noe er feil med VurderVilkårRequest-payload i lagVilkårsvurdering()')
  }
}

export interface LagretVilkår extends Vilkår {
  vilkårsvurderingId: string
}
export type InsertVilkår = Omit<LagretVilkår, 'id'>

export function lagVilkår(vilkårsvurderingId: string, vurderVilkårRequest: VurderVilkårRequest): InsertVilkår[] {
  const { bestillingsdato, brilleseddel, bestiltHosOptiker, komplettBrille, kjøptBrille } = vurderVilkårRequest.data!

  return vurderteVilkår(
    vilkårsvurderingId,
    brilleseddel!,
    komplettBrille!,
    bestiltHosOptiker,
    kjøptBrille,
    bestillingsdato
  )
}

// START Barnebrillesak

export type LagretBarnebrillesak = Omit<Barnebrillesak, 'vilkårsgrunnlag' | 'vilkårsvurdering'>
export type InsertBarnebrillesak = Omit<LagretBarnebrillesak, 'sakId'>

export function lagBarnebrillesak(): InsertBarnebrillesak {
  const fødselsdatoBruker = lagTilfeldigFødselsdato(10)
  const opprettet = lagTilfeldigDato(new Date().getFullYear()).toISOString()
  return {
    sakstype: Sakstype.BARNEBRILLER,
    status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    statusEndret: opprettet,
    opprettet,
    søknadGjelder: 'Briller til barn',
    bruker: {
      fnr: lagTilfeldigFødselsnummer(fødselsdatoBruker),
      navn: lagTilfeldigNavn(),
      fødselsdato: formatISO(fødselsdatoBruker, { representation: 'date' }),
      kommune: {
        nummer: '9999',
        navn: lagTilfeldigBosted(),
      },
      telefon: lagTilfeldigTelefonnummer(),
      kontonummer: '11111111113',
      adressebeskyttelseOgSkjerming: {
        gradering: [],
        skjermet: false,
      },
    },
    innsender: {
      fnr: lagTilfeldigFødselsnummer(42),
      navn: lagTilfeldigNavn().fulltNavn,
      adressebeskyttelseOgSkjerming: {
        gradering: [],
        skjermet: false,
      },
    },
    enhet: enheter.oslo,
    steg: StegType.INNHENTE_FAKTA,
    journalposter: [],
  }
}

// END Barnebrillesak

function lagBruker(overstyringer: Partial<Bruker> = {}): Pick<Sak, 'bruker'> {
  const fødselsdato = lagTilfeldigFødselsdato(lagTilfeldigInteger(65, 95))
  const fnr = lagTilfeldigFødselsnummer(fødselsdato)
  const navn = lagTilfeldigNavn()
  return {
    bruker: {
      fnr,
      navn,
      fulltNavn: formaterNavn(navn),
      fødselsdato: formatISO(fødselsdato, { representation: 'date' }),
      kommune: {
        nummer: '9999',
        navn: lagTilfeldigBosted(),
      },
      kjønn: Kjønn.MANN,
      telefon: lagTilfeldigTelefonnummer(),
      brukernummer: '1',
      adressebeskyttelseOgSkjerming: {
        gradering: [],
        skjermet: false,
      },
      ...overstyringer,
    },
  }
}

export interface LagretSakshendelse extends Hendelse {
  sakId: string
}
export type InsertSakshendelse = Omit<LagretSakshendelse, 'id'>

import { formatISO } from 'date-fns'

import { BehovsmeldingType } from '../../types/BehovsmeldingTypes.ts'
import {
  type Barnebrillesak,
  type Hendelse,
  OppgaveStatusType,
  type Sak,
  Sakstype,
  StegType,
} from '../../types/types.internal.ts'
import { BehovsmeldingCase } from './BehovsmeldingStore.ts'
import { lagTilfeldigBosted } from './bosted.ts'
import { enheter } from './enheter.ts'
import { lagTilfeldigDato, lagTilfeldigFødselsdato, lagTilfeldigTelefonnummer } from './felles.ts'
import { fødselsdatoFraFødselsnummer, kjønnFraFødselsnummer, lagTilfeldigFødselsnummer } from './fødselsnummer.ts'
import { lagTilfeldigNavn } from './navn.ts'

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
export type InsertHjelpemiddelsak = LagretHjelpemiddelsak & { behovsmeldingCasePath: string }

export function lagHjelpemiddelsakForBehovsmeldingCase(
  behovsmeldingCasePath: string,
  behovsmeldingCase: BehovsmeldingCase
): InsertHjelpemiddelsak {
  const { behovsmelding, behovsmeldingGjelder, fnrBruker, fnrInnsender, opprettet } = behovsmeldingCase
  let sakstype: Sakstype.BESTILLING | Sakstype.SØKNAD
  const { type: behovsmeldingstype, bruker } = behovsmelding
  switch (behovsmeldingstype) {
    case BehovsmeldingType.BESTILLING:
      sakstype = Sakstype.BESTILLING
      break
    case BehovsmeldingType.SØKNAD:
      sakstype = Sakstype.SØKNAD
      break
    default:
      throw new Error(`Ukjent behovsmeldingstype: ${behovsmeldingstype}`)
  }
  return {
    behovsmeldingCasePath,
    sakId: behovsmeldingCase.sakId,
    sakstype,
    saksstatus: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    saksstatusGyldigFra: opprettet,
    opprettet,
    søknadGjelder: behovsmeldingGjelder,
    bruker: {
      fnr: fnrBruker,
      navn: bruker.navn,
      fulltNavn: `${bruker.navn.fornavn} ${bruker.navn.etternavn}`,
      fødselsdato: fødselsdatoFraFødselsnummer(fnrBruker).toDateString(),
      kommune: { nummer: bruker.kommunenummer!, navn: bruker.kommunenummer! },
      bydel: undefined,
      kjønn: kjønnFraFødselsnummer(fnrBruker),
      telefon: behovsmelding.bruker.telefon,
      brukernummer: bruker.brukernummer,
      kontonummer: undefined,
      adressebeskyttelseOgSkjerming: {
        gradering: [],
        skjermet: false,
      },
    },
    innsender: {
      fnr: fnrInnsender,
      navn: { fornavn: 'Frank', etternavn: 'Formidler' },
      fulltNavn: 'Frank Formidler',
      adressebeskyttelseOgSkjerming: {
        gradering: [],
        skjermet: false,
      },
    },
    enhet: enheter.itAvdelingen,
    saksbehandler: undefined,
    vedtak: undefined,
    greitÅViteFaktum: [],
    hast: undefined,
  }
}

// START Barnebrillesak

export type LagretBarnebrillesak = Omit<Barnebrillesak, 'vilkårsgrunnlag' | 'vilkårsvurdering'>
export type InsertBarnebrillesak = LagretBarnebrillesak

export function lagBarnebrillesak(sakId: string): InsertBarnebrillesak {
  const fødselsdatoBruker = lagTilfeldigFødselsdato(10)
  const opprettet = lagTilfeldigDato(new Date().getFullYear()).toISOString()
  return {
    sakId,
    sakstype: Sakstype.BARNEBRILLER,
    saksstatus: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    saksstatusGyldigFra: opprettet,
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

export interface LagretSakshendelse extends Hendelse {
  sakId: string
}
export type InsertSakshendelse = Omit<LagretSakshendelse, 'id'>

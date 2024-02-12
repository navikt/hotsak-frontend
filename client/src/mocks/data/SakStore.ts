import dayjs from 'dayjs'
import Dexie, { Table } from 'dexie'

import {
  Bosituasjon,
  Bruksarena,
  Formidler,
  GreitÅViteType,
  Hendelse,
  Kjønn,
  KontaktPersonType,
  Leveringsmåte,
  Oppgave,
  OppgaveStatusType,
  PersonInfoKilde,
  Sak,
  Sakstype,
  SignaturType,
  UtlevertType,
  VedtakStatusType,
} from '../../types/types.internal'
import { IdGenerator } from './IdGenerator'
import { PersonStore } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { lagTilfeldigBosted } from './bosted'
import { enheter } from './enheter'
import { lagTilfeldigFødselsdato, lagTilfeldigInteger, lagTilfeldigTelefonnummer } from './felles'
import { lagTilfeldigFødselsnummer } from './fødselsnummer'
import { lagTilfeldigNavn } from './navn'

type LagretSak = Sak

interface LagretHendelse extends Hendelse {
  sakId: string
}

function lagBruker(): Pick<Sak, 'personinformasjon' | 'bruker'> {
  const fødselsdato = lagTilfeldigFødselsdato(lagTilfeldigInteger(65, 95))
  const fnr = lagTilfeldigFødselsnummer(fødselsdato)
  const navn = lagTilfeldigNavn()
  return {
    bruker: {
      fnr,
      navn,
      fødselsdato: fødselsdato.toISODateString(),
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
    },
    personinformasjon: {
      ...navn,
      fnr,
      fødselsdato: fødselsdato.toISODateString(),
      adresse: 'Blåbærstien 82',
      kilde: PersonInfoKilde.PDL,
      signaturtype: SignaturType.BRUKER_BEKREFTER,
      telefon: '90807060',
      bosituasjon: Bosituasjon.HJEMME,
      funksjonsnedsettelser: ['bevegelse'],
      funksjonsnedsettelse: ['bevegelse'],
      bruksarena: Bruksarena.DAGLIGLIV,
      oppfylteVilkår: ['storreBehov', 'nedsattFunksjon', 'praktiskeProblem'],
      kjønn: Kjønn.MANN,
      brukernummer: '1',
      postnummer: '9999',
      poststed: lagTilfeldigBosted(),
      gtNummer: '9999',
      gtType: 'KOMMUNE',
      egenAnsatt: false,
      brukerErDigital: true,
    },
  }
}

function lagSak(sakId: number, sakstype = Sakstype.SØKNAD): LagretSak {
  const bruker = lagBruker()
  const opprettet = dayjs()
  const formidler: Formidler = {
    fnr: lagTilfeldigFødselsnummer(32),
    navn: lagTilfeldigNavn().fulltNavn,
    poststed: lagTilfeldigBosted(),
    arbeidssted: 'Kommunen',
    stilling: 'Ergoterapeut',
    postadresse: 'Gate 42',
    telefon: lagTilfeldigTelefonnummer(),
    treffestEnklest: 'Ukedager',
    epost: 'ergoterapeut@kommune.no',
  }
  return {
    ...bruker,
    sakId: sakId.toString(),
    saksinformasjon: {
      opprettet: opprettet.toISOString(),
    },
    sakstype,
    søknadGjelder: 'Hjelpemidler',
    hjelpemidler: [
      {
        id: -1,
        hmsnr: '014112',
        rangering: 1,
        alleredeUtlevert: false,
        utlevertInfo: {
          utlevertType: UtlevertType.FremskuttLager,
          annenKommentar: 'kommentar',
          overførtFraBruker: '',
        },
        antall: 1,
        kategori: 'Terskeleliminatorer og Kjøreramper',
        beskrivelse: 'Topro Terskeleliminator',
        tilleggsinfo: [],
        tilbehør: [{ hmsNr: '1234', antall: 1, navn: 'Tilbehørnavn' }],
      },
      {
        id: -1,
        hmsnr: '177946',
        rangering: 1,
        alleredeUtlevert: true,
        utlevertInfo: {
          utlevertType: UtlevertType.FremskuttLager,
          annenKommentar: 'kommentar',
          overførtFraBruker: '',
        },
        antall: 1,
        kategori: 'Rullator',
        beskrivelse: 'Gemino 20',
        tilleggsinfo: [],
        tilbehør: [],
      },
      {
        id: -1,
        hmsnr: '289689',
        rangering: 1,
        alleredeUtlevert: false,
        utlevertInfo: {
          utlevertType: UtlevertType.FremskuttLager,
          annenKommentar: '',
          overførtFraBruker: '',
        },
        antall: 1,
        kategori: 'Alarm- og varslingshjelpemidler',
        beskrivelse: 'Varslingsmottaker Nora Flexiwatch, LIFE',
        tilleggsinfo: [],
        tilbehør: [],
      },
    ],
    formidler,
    innsender: {
      fnr: formidler.fnr,
      navn: formidler.navn,
      adressebeskyttelseOgSkjerming: {
        gradering: [],
        skjermet: false,
      },
    },
    greitÅViteFaktum: [
      {
        beskrivelse:
          'Bruker bor på institusjon (sykehjem), ifølge formidler. Du må sjekke om vilkårene for institusjon er oppfylt.',
        type: GreitÅViteType.ADVARSEL,
      },
      {
        beskrivelse: 'Kun førsterangering',
        type: GreitÅViteType.INFO,
      },
      {
        beskrivelse: 'Personalia fra Folkeregisteret',
        type: GreitÅViteType.INFO,
      },
      {
        beskrivelse: 'Medlem av folketrygden',
        type: GreitÅViteType.INFO,
      },
    ],
    mottattDato: opprettet.toISOString(),
    levering: {
      kontaktperson: {
        navn: 'Nullable kontaktpersonnavn',
        telefon: 'Nullable kontaktperson tlf',
        kontaktpersonType: KontaktPersonType.HJELPEMIDDELBRUKER,
      },
      leveringsmåte: Leveringsmåte.FOLKEREGISTRERT_ADRESSE,
      adresse: lagTilfeldigBosted(),
      merknad: 'Ta også kontakt med meg dvs. formidler ved utlevering',
    },
    oppfølgingsansvarlig: {
      navn: lagTilfeldigNavn().fulltNavn,
      arbeidssted: 'Kommunen',
      stilling: 'Ergoterapeut',
      telefon: lagTilfeldigTelefonnummer(),
      ansvarFor: '',
    },
    status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    statusEndret: opprettet.toISOString(),
    enhet: enheter.oslo,
  }
}

export class SakStore extends Dexie {
  private readonly saker!: Table<LagretSak, string>
  private readonly hendelser!: Table<LagretHendelse, string>

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly personStore: PersonStore
  ) {
    super('SakStore')
    this.version(1).stores({
      saker: 'sakId',
      hendelser: '++id,sakId',
    })
  }

  async populer() {
    const count = await this.saker.count()
    if (count !== 0) {
      return []
    }
    const lagSakMedId = (sakstype = Sakstype.SØKNAD) => lagSak(this.idGenerator.nesteId(), sakstype)
    return this.lagreAlle([
      lagSakMedId(),
      lagSakMedId(),
      lagSakMedId(),
      lagSakMedId(),
      lagSakMedId(Sakstype.BESTILLING),
    ])
  }

  async lagreAlle(saker: LagretSak[]) {
    await this.personStore.lagreAlle(
      saker.map(({ bruker: { navn, kjønn, ...rest } }) => ({
        ...navn,
        ...rest,
        navn,
        kjønn: kjønn || Kjønn.UKJENT,
        enhet: enheter.agder,
      }))
    )
    return this.saker.bulkAdd(saker, { allKeys: true })
  }

  async alle() {
    return this.saker.toArray()
  }

  async oppgaver() {
    const saker = await this.alle()
    return saker.map<Oppgave>(({ bruker, personinformasjon, ...sak }) => ({
      sakId: sak.sakId,
      sakstype: sak.sakstype,
      status: sak.status,
      statusEndret: sak.statusEndret,
      beskrivelse: sak.søknadGjelder,
      mottatt: sak.saksinformasjon.opprettet,
      innsender: sak.innsender.navn,
      bruker: {
        fnr: bruker.fnr,
        funksjonsnedsettelser: personinformasjon.funksjonsnedsettelser,
        bosted: bruker.kommune.navn,
        ...bruker.navn,
      },
      enhet: sak.enhet,
      saksbehandler: sak.saksbehandler,
      kanTildeles: true,
    }))
  }

  async hent(sakId: string) {
    const sak = await this.saker.get(sakId)
    if (!sak) {
      return
    }
    return sak
  }

  async lagreHendelse(sakId: string, hendelse: string, detaljer?: string) {
    const { navn: bruker } = await this.saksbehandlerStore.innloggetSaksbehandler()
    return this.hendelser.put({
      id: this.idGenerator.nesteId().toString(),
      opprettet: dayjs().toISOString(),
      sakId,
      hendelse,
      detaljer,
      bruker,
    })
  }

  async hentHendelser(sakId: string) {
    return this.hendelser.where('sakId').equals(sakId).toArray()
  }

  async tildel(sakId: string) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    await this.saker.update(sakId, {
      saksbehandler: saksbehandler,
      status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
    })
    await this.lagreHendelse(sakId, 'Saksbehandler har tatt saken')
    return true
  }

  async frigi(sakId: string) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }
    await this.saker.update(sakId, {
      saksbehandler: undefined,
      status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    })
    await this.lagreHendelse(sakId, 'Saksbehandler er meldt av saken')
    return true
  }

  async oppdaterStatus(sakId: string, status: OppgaveStatusType) {
    const sak = await this.hent(sakId)

    if (!sak) {
      return false
    }
    if (sak.status === status) {
      return false
    } else {
      this.transaction('rw', this.saker, () => {
        this.saker.update(sakId, {
          status: status,
        })
      })
      return true
    }
  }

  async fattVedtak(sakId: string, status: OppgaveStatusType, vedtakStatus: VedtakStatusType) {
    const nå = dayjs().toISOString()
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }

    if (sak.status === status) {
      return false
    } else {
      this.transaction('rw', this.saker, this.hendelser, () => {
        this.saker.update(sakId, {
          status: status,
          vedtak: {
            vedtaksdato: nå,
            status: vedtakStatus,
            saksbehandlerNavn: sak.saksbehandler?.navn,
            saksbehandlerRef: sak.saksbehandler?.id,
          },
        })
      })
      return true
    }
  }
}

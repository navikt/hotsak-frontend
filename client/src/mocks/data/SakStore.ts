import { formatISO } from 'date-fns'
import Dexie, { Table } from 'dexie'

import {
  Bosituasjon,
  Bruker,
  Bruksarena,
  EndreHjelpemiddelRequest,
  Formidler,
  GreitÅViteType,
  Hasteårsak,
  Hendelse,
  Kjønn,
  KontaktpersonType,
  Leveringsmåte,
  Oppgave,
  OppgaveStatusType,
  PersonInfoKilde,
  Sak,
  Sakstype,
  SignaturType,
  UtlevertType,
  VarigFunksjonsnedsettelse,
  VedtakStatusType,
} from '../../types/types.internal'
import { formaterNavn } from '../../utils/formater'
import { lagTilfeldigBosted } from './bosted'
import { enheter } from './enheter'
import { lagTilfeldigFødselsdato, lagTilfeldigInteger, lagTilfeldigTelefonnummer } from './felles'
import { lagTilfeldigFødselsnummer } from './fødselsnummer'
import { IdGenerator } from './IdGenerator'
import { lagTilfeldigNavn } from './navn'
import { PersonStore } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'

type LagretSak = Sak

interface LagretHendelse extends Hendelse {
  sakId: string
}

function lagBruker(overstyringer: Partial<Bruker> = {}): Pick<Sak, 'personinformasjon' | 'bruker'> {
  const fødselsdato = lagTilfeldigFødselsdato(lagTilfeldigInteger(65, 95))
  const fnr = lagTilfeldigFødselsnummer(fødselsdato)
  const navn = lagTilfeldigNavn()
  return {
    bruker: {
      fnr,
      navn,
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
    personinformasjon: {
      ...navn,
      fnr,
      fødselsdato: formatISO(fødselsdato, { representation: 'date' }),
      kilde: PersonInfoKilde.PDL,
      signaturtype: SignaturType.BRUKER_BEKREFTER,
      telefon: '90807060',
      bosituasjon: Bosituasjon.HJEMME,
      funksjon: {
        varigFunksjonsnedsettelse: VarigFunksjonsnedsettelse.ALDERDOMSSVEKKELSE,
        funksjonsvurdering:
          'Her viser vi formidler sin tekst som beskriver hvordan innbygger fungerer med sin funksjonsnedsettelse i daglige gjøremål. Den kan være lang eller kort, avhengig av hvor mye formidler skriver.',
      },
      funksjonsnedsettelser: ['bevegelse'],
      bruksarena: Bruksarena.DAGLIGLIV,
      oppfylteVilkår: [
        'PRAKTISKE_PROBLEMER_I_DAGLIGLIVET_V1',
        /* Fjernet et vilkår i forbindelse med utprøving av mer utfyllende "Brukers funksjon". I andre miljøer ann labs kommer denne lista fra søknaden så det bør ikke være noe vi trenger å ha et aktivt forhold til  */
        //'VESENTLIG_OG_VARIG_NEDSATT_FUNKSJONSEVNE_V1',
        'KAN_IKKE_LOESES_MED_ENKLERE_HJELPEMIDLER_V1',
        'I_STAND_TIL_AA_BRUKE_HJELEPMIDLENE_V1',
      ],
      kjønn: Kjønn.MANN,
      brukernummer: '1',
      adresse: 'Blåbærstien 82',
      postnummer: '9999',
      poststed: lagTilfeldigBosted(),
      kommunenummer: '9999',
      gtNummer: '9999',
      gtType: 'KOMMUNE',
      egenAnsatt: false,
      brukerErDigital: true,
    },
  }
}

function lagSak(
  sakId: number,
  sakstype = Sakstype.SØKNAD,
  overstyringer: {
    bruker?: Partial<Bruker>
  } = {}
): LagretSak {
  const bruker = lagBruker(overstyringer.bruker)
  const opprettet = new Date()
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
    søknadGjelder: 'Søknad om: terskeleliminator, rullator',
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
        tilleggsinfo: [{ tittel: 'Bruksarena', innholdsliste: ['I eget hjem.'] }],
        tilbehør: [
          {
            hmsNr: '1234',
            antall: 1,
            navn: 'Tilbehørnavn 1',
            begrunnelse: 'Trenger denne fordi bruker har spesielle behov.',
          },
          { hmsNr: '4321', antall: 3, navn: 'Tilbehørnavn 2', fritakFraBegrunnelseÅrsak: 'ER_PÅ_BESTILLINGSORDNING' },
        ],
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
        navn: lagTilfeldigNavn().fulltNavn,
        telefon: '99887766',
        kontaktpersonType: KontaktpersonType.HJELPEMIDDELBRUKER,
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
    hast: (() => {
      return {
        årsaker: [Hasteårsak.ANNET],
        begrunnelse: 'Det haster veldig!',
      }
    })(),
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
    const lagSakMedId = (
      sakstype = Sakstype.SØKNAD,
      overstyringer: {
        bruker?: Partial<Bruker>
      } = {}
    ) => lagSak(this.idGenerator.nesteId(), sakstype, overstyringer)
    return this.lagreAlle([
      lagSakMedId(),
      lagSakMedId(),
      lagSakMedId(),
      lagSakMedId(Sakstype.SØKNAD, {
        bruker: {
          dødsdato: '2024-09-02',
        },
      }),
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
      innsender: formaterNavn(sak.innsender.navn),
      bruker: {
        fnr: bruker.fnr,
        funksjonsnedsettelser: personinformasjon.funksjonsnedsettelser,
        bosted: bruker.kommune.navn,
        ...bruker.navn,
      },
      enhet: sak.enhet,
      saksbehandler: sak.saksbehandler,
      kanTildeles: true,
      hast: sak.hast,
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
      opprettet: new Date().toISOString(),
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
            vedtaksdato: new Date().toISOString(),
            status: vedtakStatus,
            saksbehandlerNavn: sak.saksbehandler?.navn || '',
            saksbehandlerRef: sak.saksbehandler?.id || '',
            soknadUuid: '',
          },
        })
      })
      return true
    }
  }

  async endreHjelpemiddel(sakId: string, request: EndreHjelpemiddelRequest) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    } else {
      this.transaction('rw', this.saker, () => {
        this.saker.update(sakId, {
          hjelpemidler: sak.hjelpemidler.map((hjelpemiddel) => {
            if (hjelpemiddel.hmsnr === request.hmsNr) {
              return {
                ...hjelpemiddel,
                endretHjelpemiddel: {
                  hmsNr: request.endretHmsNr,
                  begrunnelse: request.begrunnelse,
                  begrunnelseFritekst: request.begrunnelseFritekst,
                },
              }
            }
            return hjelpemiddel
          }),
        })
      })
    }
  }
}

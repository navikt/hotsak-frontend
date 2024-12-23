import { formatISO } from 'date-fns'
import Dexie, { Table } from 'dexie'

import {
  Bruker,
  GreitÅViteType,
  Hendelse,
  Kjønn,
  Oppgave,
  OppgaveStatusType,
  Sak,
  Sakstype,
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

function lagBruker(overstyringer: Partial<Bruker> = {}): Pick<Sak, 'bruker'> {
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
    /*personinformasjon: {
      kilde: PersonInfoKilde.PDL,
      signaturtype: SignaturType.BRUKER_BEKREFTER,
      bosituasjon: Bosituasjon.HJEMME,
      funksjonsnedsettelser: ['bevegelse'],
      bruksarena: Bruksarena.DAGLIGLIV,
      adresse: 'Blåbærstien 82',
      postnummer: '9999',
      poststed: lagTilfeldigBosted(),
    },*/
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
  /*const formidler: Formidler = {
    fnr: lagTilfeldigFødselsnummer(32),
    navn: lagTilfeldigNavn().fulltNavn,
    poststed: lagTilfeldigBosted(),
    arbeidssted: 'Kommunen',
    stilling: 'Ergoterapeut',
    postadresse: 'Gate 42',
    telefon: lagTilfeldigTelefonnummer(),
    treffestEnklest: 'Ukedager',
    epost: 'ergoterapeut@kommune.no',
  }*/

  return {
    ...bruker,
    sakId: sakId.toString(),
    opprettet: opprettet.toISOString(),
    sakstype,
    søknadGjelder: 'Søknad om: terskeleliminator, rullator',
    //hjelpemidler: [
    //{
    //id: -1,
    //hmsnr: '014112',
    //rangering: 1,
    //alleredeUtlevert: false,
    /*utlevertInfo: {
          utlevertType: UtlevertType.FremskuttLager,
          annenKommentar: 'kommentar',
          overførtFraBruker: '',
        },*/
    //antall: 1,
    //kategori: 'Terskeleliminatorer og Kjøreramper',
    //beskrivelse: 'Topro Terskeleliminator',
    //tilleggsinfo: [{ tittel: 'Bruksarena', innholdsliste: ['I eget hjem.'] }],
    /*tilbehør: [
          {
            hmsNr: '1234',
            antall: 1,
            navn: 'Tilbehørnavn 1',
            begrunnelse: 'Trenger denne fordi bruker har spesielle behov.',
          },
          { hmsNr: '4321', antall: 3, navn: 'Tilbehørnavn 2', fritakFraBegrunnelseÅrsak: 'ER_PÅ_BESTILLINGSORDNING' },
        ],*/
    //bytter: [],
    // },
    //{
    //id: -1,
    //hmsnr: '177946',
    //rangering: 1,
    //alleredeUtlevert: true,
    /*utlevertInfo: {
          utlevertType: UtlevertType.FremskuttLager,
          annenKommentar: 'kommentar',
          overførtFraBruker: '',
        },*/
    //antall: 1,
    //kategori: 'Rullator',
    //beskrivelse: 'Gemino 20',
    //tilleggsinfo: [],
    //tilbehør: [],
    /*bytter: [
          {
            hmsnr: '267912',
            hjmNavn: 'Classic Soft',
            serienr: undefined,
            erTilsvarende: false,
            hjmKategori: 'Krykke',
            årsak: undefined,
          },
        ],*/
    // },
    // {
    //    id: -1,
    //  hmsnr: '289689',
    //rangering: 1,
    //alleredeUtlevert: false,
    /*utlevertInfo: {
          utlevertType: UtlevertType.FremskuttLager,
          annenKommentar: '',
          overførtFraBruker: '',
        },*/
    //antall: 1,
    //kategori: 'Alarm- og varslingshjelpemidler',
    //beskrivelse: 'Varslingsmottaker Nora Flexiwatch, LIFE',
    //tilleggsinfo: [],
    //tilbehør: [],
    //bytter: [],
    //  },
    // ],
    //formidler,
    innsender: {
      fnr: lagTilfeldigFødselsnummer(32),
      navn: lagTilfeldigNavn().fulltNavn,
      adressebeskyttelseOgSkjerming: {
        gradering: [],
        skjermet: false,
      },
    },
    greitÅViteFaktum: [
      /*{
      TODO, gjør dette også via utvidelser
        beskrivelse:
          'Bruker bor på institusjon (sykehjem), ifølge formidler. Du må sjekke om vilkårene for institusjon er oppfylt.',
        type: GreitÅViteType.ADVARSEL,
      },*/
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
    /*levering: {
      kontaktperson: {
        navn: lagTilfeldigNavn().fulltNavn,
        telefon: '99887766',
        kontaktpersonType: KontaktpersonType.HJELPEMIDDELBRUKER,
      },
      leveringsmåte: Leveringsmåte.ANNEN_ADRESSE,
      adresse: lagTilfeldigBosted(),
      merknad:
        'Pasienten har sterk angst og slipper ikke alltid inn folk. Det kan også være problemet med kommunikasjon over telefon pga. bruker har afasi. Send sms.',
    },*/
    /*oppfølgingsansvarlig: {
      navn: lagTilfeldigNavn().fulltNavn,
      arbeidssted: 'Kommunen',
      stilling: 'Ergoterapeut',
      telefon: lagTilfeldigTelefonnummer(),
      ansvarFor: '',
    },*/
    status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    statusEndret: opprettet.toISOString(),
    enhet: enheter.oslo,
    // TODO tilby hast som en overstyring
    /*hast: (() => {
      return {
        årsaker: [Hasteårsak.ANNET],
        begrunnelse: 'Det haster veldig!',
      }
    })(),*/
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
      lagSakMedId(Sakstype.SØKNAD),
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
    return saker.map<Oppgave>(({ bruker, /*personinformasjon,*/ ...sak }) => ({
      sakId: sak.sakId,
      sakstype: sak.sakstype,
      status: sak.status,
      statusEndret: sak.statusEndret,
      beskrivelse: sak.søknadGjelder,
      mottatt: sak.opprettet,
      innsender: formaterNavn(sak.innsender.navn),
      bruker: {
        fnr: bruker.fnr,
        // TODDO utled dette fra funksjonsnedsettelser
        funksjonsnedsettelser: ['bevegelse'],
        bosted: bruker.kommune.navn,
        ...bruker.navn,
      },
      enhet: sak.enhet,
      saksbehandler: sak.saksbehandler,
      kanTildeles: true,
      //hast: sak.hast,
    }))
  }

  async hent(sakId: string) {
    const sak = await this.saker.get(sakId)
    if (!sak) {
      return
    }
    return sak
  }

  async lagreHendelse(sakId: string, hendelse: string, detaljer?: string, noenAndre: boolean = false) {
    let { navn: bruker } = await this.saksbehandlerStore.innloggetSaksbehandler()
    if (noenAndre) {
      const { navn: annenBruker } = await this.saksbehandlerStore.ikkeInnloggetSaksbehandler()
      bruker = annenBruker
    }
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

  async tildel(sakId: string, noenAndre: boolean = false) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }
    let saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    if (noenAndre) {
      saksbehandler = await this.saksbehandlerStore.ikkeInnloggetSaksbehandler()
    }
    await this.saker.update(sakId, {
      saksbehandler: saksbehandler,
      status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
    })
    await this.lagreHendelse(sakId, 'Saksbehandler har tatt saken', undefined, noenAndre)
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

  /*async endreHjelpemiddel(sakId: string, request: EndreHjelpemiddelRequest) {
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
  }*/
}

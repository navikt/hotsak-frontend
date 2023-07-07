import dayjs from 'dayjs'
import Dexie, { Table } from 'dexie'

import {
  Adressebeskyttelse,
  Barnebrillesak,
  BrevTekst,
  Hendelse,
  JournalføringRequest,
  Kjønn,
  Notat,
  OppdaterVilkårRequest,
  Oppgave,
  OppgaveStatusLabel,
  OppgaveStatusType,
  Oppgavetype,
  StegType,
  Totrinnskontroll,
  TotrinnskontrollData,
  TotrinnskontrollVurdering,
  Utbetalingsmottaker,
  Vilkår,
  Vilkårsgrunnlag,
  VilkårsResultat,
  Vilkårsvurdering,
  VurderVilkårRequest,
} from '../../types/types.internal'
import { IdGenerator } from './IdGenerator'
import { JournalpostStore } from './JournalpostStore'
import { PersonStore } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { beregnSats } from './beregnSats'
import { lagTilfeldigBosted } from './bosted'
import { enheter } from './enheter'
import { lagTilfeldigFødselsdato, lagTilfeldigTelefonnummer } from './felles'
import { lagTilfeldigFødselsnummer } from './fødselsnummer'
import { lagTilfeldigNavn } from './navn'

const datoOrdningenStartet = '2022-08-01'

type LagretBarnebrillesak = Omit<Barnebrillesak, 'vilkårsgrunnlag' | 'vilkårsvurdering'>
type LagretVilkårsgrunnlag = Vilkårsgrunnlag
type LagretVilkårsvurdering = Omit<Vilkårsvurdering, 'vilkår'>

interface LagretVilkår extends Vilkår {
  vilkårsvurderingId: string
}

interface LagretHendelse extends Hendelse {
  sakId: string
}

function lagVilkårsgrunnlag(sakId: string, vurderVilkårRequest: VurderVilkårRequest): LagretVilkårsgrunnlag {
  return {
    ...vurderVilkårRequest,
    sakId,
  }
}

function lagVilkårsvurdering(sakId: string, vurderVilkårRequest: VurderVilkårRequest): LagretVilkårsvurdering {
  const { brillepris, brilleseddel } = vurderVilkårRequest
  const { sats, satsBeløp, satsBeskrivelse, beløp } = beregnSats(brilleseddel, brillepris)
  return {
    id: sakId,
    sakId,
    resultat: VilkårsResultat.JA,
    sats,
    satsBeløp,
    satsBeskrivelse,
    beløp,
    opprettet: dayjs().toISOString(),
  }
}

function lagVilkår(
  vilkårsvurderingId: string,
  vurderVilkårRequest: VurderVilkårRequest
): Array<Omit<LagretVilkår, 'id'>> {
  const { bestillingsdato, brilleseddel } = vurderVilkårRequest
  return [
    {
      vilkårsvurderingId,
      vilkårId: 'UNDER_18_ÅR_PÅ_BESTILLINGSDATO',
      beskrivelse: 'Barnet må være under 18 år på bestillingsdato',
      lovReferanse: '§ 2, 4. ledd',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Barnet var under 18 år på bestillingsdato',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        barnetsAlder: '06.09 2016 (6 år)', // fixme
        bestillingsdato,
      },
    },
    {
      vilkårsvurderingId,
      vilkårId: 'MEDLEM_AV_FOLKETRYGDEN',
      beskrivelse: 'Medlem av folketrygden',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Barnet er antatt medlem i folketrygden basert på folkeregistrert adresse i Norge',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        bestillingsdato,
        forenkletSjekkResultat: 'Oppfylt',
      },
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BESTILT_HOS_OPTIKER',
      beskrivelse: 'Brillen må bestilles hos optiker',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: VilkårsResultat.JA,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'KOMPLETT_BRILLE',
      beskrivelse: 'Bestillingen inneholder brilleglass',
      lovReferanse: '§ 2',
      lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: VilkårsResultat.JA,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'HAR_IKKE_VEDTAK_I_KALENDERÅRET',
      beskrivelse: 'Ikke fått støtte til barnebriller tidligere i år - manuelt Hotsak-vedtak',
      lovReferanse: '§ 3',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§3',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Barnet har ikke vedtak om brille i kalenderåret',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BRILLESTYRKE',
      beskrivelse: 'Brillestyrken er innenfor fastsatte styrker',
      lovReferanse: '§ 2, 2. ledd',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§4',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Høyre sfære oppfyller vilkår om brillestyrke ≥ 1.0',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        ...brilleseddel,
      },
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BESTILLINGSDATO_TILBAKE_I_TID',
      beskrivelse: 'Bestillingsdato innenfor gyldig periode',
      lovReferanse: '§ 6, 2. ledd',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§6',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Bestillingsdato er innenfor gyldig periode',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        bestillingsdato,
        seksMånederSiden: dayjs(bestillingsdato).subtract(6, 'month').toISOString(),
        førsteJournalpostOpprettet: '2023-04-18', // fixme
        lanseringsdatoForManuellInnsending: '2023-03-15',
        første6MndFristForManuelleBarnebrillesøknader: '16.09 2023',
      },
    },
    {
      vilkårsvurderingId,
      vilkårId: 'BESTILLINGSDATO',
      beskrivelse: 'Bestillingen er gjort etter at loven trådte i kraft',
      lovReferanse: '§ 13',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§13',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Bestillingsdato er 01.08.2022 eller senere',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        bestillingsdato,
        datoOrdningenStartet,
      },
    },
  ]
}

function lagBarnebrillesak(sakId: number, adressebeskyttelse?: Adressebeskyttelse): LagretBarnebrillesak {
  const fødselsdatoBruker = lagTilfeldigFødselsdato(10)
  const opprettet = dayjs().toISOString()
  return {
    sakId: sakId.toString(),
    saksinformasjon: {
      opprettet,
    },
    sakstype: Oppgavetype.BARNEBRILLER,
    søknadGjelder: 'Briller til barn',
    bruker: {
      fnr: lagTilfeldigFødselsnummer(fødselsdatoBruker),
      fødselsdato: fødselsdatoBruker.toISODateString(),
      adressebeskyttelse,
      kommune: {
        nummer: '9999',
        navn: lagTilfeldigBosted(),
      },
      kontonummer: '11111111113',
      navn: lagTilfeldigNavn(),
      telefon: lagTilfeldigTelefonnummer(),
    },
    innsender: {
      fnr: lagTilfeldigFødselsnummer(42),
      navn: lagTilfeldigNavn().fulltNavn,
      adressebeskyttelse,
    },
    status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    statusEndret: opprettet,

    steg: StegType.INNHENTE_FAKTA,
    enhet: enheter.oslo,
    journalposter: [],
  }
}

export class BarnebrillesakStore extends Dexie {
  private readonly saker!: Table<LagretBarnebrillesak, string>
  private readonly vilkårsgrunnlag!: Table<LagretVilkårsgrunnlag, string>
  private readonly vilkårsvurderinger!: Table<LagretVilkårsvurdering, string>
  private readonly vilkår!: Table<LagretVilkår, number>
  private readonly hendelser!: Table<LagretHendelse, string>
  private readonly notater!: Table<Omit<Notat, 'id'>, number>
  private readonly brevtekst!: Table<BrevTekst, string>

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly personStore: PersonStore,
    private readonly journalpostStore: JournalpostStore
  ) {
    super('BarnebrillesakStore')
    this.version(1).stores({
      saker: 'sakId',
      vilkårsgrunnlag: 'sakId',
      vilkårsvurderinger: 'id,sakId',
      vilkår: '++id,vilkårsvurderingId',
      hendelser: '++id,sakId',
      notater: '++id,sakId',
      brevtekst: 'sakId',
    })
  }

  async populer() {
    const count = await this.saker.count()
    if (count !== 0) {
      return []
    }
    const lagBarnebrillesakMedId = (adressebeskyttelse?: Adressebeskyttelse) =>
      lagBarnebrillesak(this.idGenerator.nesteId(), adressebeskyttelse)

    return this.lagreAlle([
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesak(1111),
      lagBarnebrillesakMedId(Adressebeskyttelse.FORTROLIG),
      lagBarnebrillesakMedId(Adressebeskyttelse.STRENGT_FORTROLIG),
      lagBarnebrillesakMedId(Adressebeskyttelse.STRENGT_FORTROLIG_UTLAND),
    ])
  }

  async lagreAlle(saker: LagretBarnebrillesak[]) {
    const journalposter = await this.journalpostStore.alle()
    await this.personStore.lagreAlle(
      saker.map(({ bruker: { navn, kjønn, ...rest } }) => ({
        ...navn,
        ...rest,
        kjønn: kjønn || Kjønn.UKJENT,
        enhet: enheter.agder,
      }))
    )
    return this.saker.bulkAdd(
      saker.map((sak) => ({
        ...sak,
        journalposter: [journalposter[0].journalpostID],
      })),
      { allKeys: true }
    )
  }

  async alle() {
    return this.saker.toArray()
  }

  async oppgaver() {
    const saker = await this.alle()
    return saker.map<Oppgave>(({ bruker, ...sak }) => ({
      sakId: sak.sakId,
      sakstype: Oppgavetype.TILSKUDD,
      status: sak.status,
      statusEndret: sak.statusEndret,
      beskrivelse: sak.søknadGjelder,
      mottatt: sak.saksinformasjon.opprettet,
      innsender: sak.innsender.navn,
      bruker: {
        fnr: bruker.fnr,
        funksjonsnedsettelser: ['syn'],
        bosted: bruker.kommune.navn,
        ...bruker.navn,
      },
      enhet: sak.enhet,
      saksbehandler: sak.saksbehandler,
      kanTildeles: true,
    }))
  }

  async hent(sakId: string): Promise<Barnebrillesak | undefined> {
    const sak = await this.saker.get(sakId)
    if (!sak) {
      return
    }
    const vilkårsgrunnlag = await this.vilkårsgrunnlag.get(sakId)
    const vilkårsvurdering = await this.vilkårsvurderinger.where('sakId').equals(sakId).first()
    if (vilkårsvurdering) {
      const vilkår = await this.vilkår.where('vilkårsvurderingId').equals(vilkårsvurdering.id).toArray()
      return {
        ...sak,
        vilkårsgrunnlag,
        vilkårsvurdering: {
          ...vilkårsvurdering,
          vilkår,
        },
      }
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
    this.transaction('rw', this.saker, this.hendelser, () => {
      this.saker.update(sakId, {
        saksbehandler: saksbehandler,
        status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
      })
      this.lagreHendelse(sakId, 'Saksbehandler har tatt saken')
    })
    return true
  }

  async frigi(sakId: string) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }
    this.transaction('rw', this.saker, this.hendelser, () => {
      this.saker.update(sakId, {
        saksbehandler: undefined,
        status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
      })
      this.lagreHendelse(sakId, 'Saksbehandler er meldt av saken')
    })
    return true
  }

  async oppdaterSteg(sakId: string, steg: StegType) {
    return this.saker.update(sakId, {
      steg,
    })
  }

  async oppdaterStatus(sakId: string, status: OppgaveStatusType) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }
    this.transaction('rw', this.saker, this.hendelser, () => {
      this.saker.update(sakId, {
        status: status,
      })
      this.lagreHendelse(sakId, `Sakstatus endret: ${OppgaveStatusLabel.get(status)}`)
      this.lagreHendelse(sakId, 'Brev sendt', 'Innhente opplysninger')
    })
    return true
  }

  async oppdaterUtbetalingsmottaker(sakId: string, fnr: string): Promise<Utbetalingsmottaker> {
    const utbetalingsmottaker: Utbetalingsmottaker = {
      fnr,
      navn: lagTilfeldigNavn().fulltNavn,
      kontonummer: '11111111113',
    }
    await this.saker.update(sakId, {
      utbetalingsmottaker,
    })
    return utbetalingsmottaker
  }

  async vurderVilkår(sakId: string, vurderVilkårRequest: VurderVilkårRequest) {
    return this.transaction('rw', this.saker, this.vilkårsgrunnlag, this.vilkårsvurderinger, this.vilkår, async () => {
      const vilkårsgrunnlag = lagVilkårsgrunnlag(sakId, vurderVilkårRequest)
      await this.vilkårsgrunnlag.put(vilkårsgrunnlag, sakId)
      const vilkårsvurdering = lagVilkårsvurdering(sakId, vurderVilkårRequest)
      const vilkårsvurderingId = await this.vilkårsvurderinger.put(vilkårsvurdering)
      const vilkår = lagVilkår(vilkårsvurderingId, vurderVilkårRequest)
      await this.vilkår.where('vilkårsvurderingId').equals(vilkårsvurdering.id).delete()
      await this.vilkår.bulkAdd(vilkår as any, { allKeys: true }) // fixme
      return this.oppdaterSteg(sakId, StegType.VURDERE_VILKÅR)
    })
  }

  async oppdaterVilkår(
    sakId: string,
    vilkårId: number | string,
    { resultatSaksbehandler, begrunnelseSaksbehandler }: OppdaterVilkårRequest
  ) {
    vilkårId = Number(vilkårId)
    return this.vilkår.update(vilkårId, {
      resultatSaksbehandler,
      begrunnelseSaksbehandler,
    })
  }

  async sendTilGodkjenning(sakId: string) {
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    const totrinnskontroll: Totrinnskontroll = {
      saksbehandler,
      opprettet: dayjs().toISOString(),
    }
    return this.transaction('rw', this.saker, this.hendelser, () => {
      this.saker.update(sakId, {
        saksbehandler: undefined,
        steg: StegType.GODKJENNE,
        status: OppgaveStatusType.AVVENTER_GODKJENNER,
        totrinnskontroll,
      })
      this.lagreHendelse(sakId, 'Sak sendt til godkjenning')
    })
  }

  async ferdigstillTotrinnskontroll(sakId: string, { resultat, begrunnelse }: TotrinnskontrollData) {
    const nå = dayjs().toISOString()
    const sak = await this.hent(sakId)
    if (!sak || !sak.totrinnskontroll) {
      return Promise.reject('noe gikk galt')
    }

    const lagretTotrinnskontroll = sak.totrinnskontroll
    const godkjenner = await this.saksbehandlerStore.innloggetSaksbehandler()
    return this.transaction('rw', this.saker, this.hendelser, () => {
      if (resultat === TotrinnskontrollVurdering.GODKJENT) {
        const totrinnskontroll: Partial<Totrinnskontroll> = {
          ...lagretTotrinnskontroll,
          godkjenner,
          resultat,
          begrunnelse,
          godkjent: nå,
        }
        this.saker.update(sakId, {
          saksbehandler: totrinnskontroll.saksbehandler,
          steg: StegType.FERDIG_BEHANDLET,
          status: OppgaveStatusType.VEDTAK_FATTET,
          totrinnskontroll,
        })
        this.lagreHendelse(sakId, 'Vedtak fattet')
      }

      if (resultat === TotrinnskontrollVurdering.RETURNERT) {
        const totrinnskontroll: Partial<Totrinnskontroll> = {
          ...lagretTotrinnskontroll,
          godkjenner,
          resultat,
          begrunnelse,
        }
        this.saker.update(sakId, {
          saksbehandler: totrinnskontroll.saksbehandler,
          steg: StegType.REVURDERE,
          status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
          totrinnskontroll,
        })
        this.lagreHendelse(sakId, 'Sak returnert til saksbehandler')
      }
    })
  }

  async opprettSak(journalføring: JournalføringRequest) {
    const sak = lagBarnebrillesak(this.idGenerator.nesteId())
    sak.bruker.fnr = journalføring.journalføresPåFnr
    sak.journalposter = [journalføring.journalpostID]
    return this.saker.add(sak)
  }

  async knyttJournalpostTilSak(journalføring: JournalføringRequest) {
    const sakId = journalføring.sakId

    if (!sakId) {
      return
    }

    const eksisterendeSak = await this.saker.get(sakId)

    if (!eksisterendeSak) {
      return
    }

    const eksisterendeJournalposter = eksisterendeSak.journalposter
    this.saker.update(sakId, { journalposter: [...eksisterendeJournalposter, journalføring.journalpostID] })
  }

  async lagreNotat(sakId: string, type: 'INTERNT', innhold: string) {
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    return this.notater.add({
      sakId,
      saksbehandler,
      type,
      innhold,
      opprettet: dayjs().toISOString(),
    })
  }

  async slettNotat(notatId: number) {
    return this.notater.delete(notatId)
  }

  async hentNotater(sakId: string) {
    return this.notater.where('sakId').equals(sakId).toArray()
  }

  async lagreBrevtekst(sakId: string, brevmal: string, brevtekst: string) {
    this.brevtekst.put({ brevmal, brevtekst, sakId }, sakId)
  }

  async hentBrevtekst(sakId: string) {
    return this.brevtekst.where('sakId').equals(sakId).first()
  }
}

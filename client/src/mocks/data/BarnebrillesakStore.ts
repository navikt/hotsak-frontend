import dayjs from 'dayjs'
import Dexie, { Table } from 'dexie'

import {
  Brillesak,
  ID,
  OppdaterVilkårRequest,
  Oppgave,
  OppgaveStatusType,
  Oppgavetype,
  StegType,
  Totrinnskontroll,
  TotrinnskontrollData,
  Utbetalingsmottaker,
  Vilkår,
  Vilkårsgrunnlag,
  VilkårsResultat,
  Vilkårsvurdering,
  VurderVilkårRequest,
} from '../../types/types.internal'
import { JournalpostStore } from './JournalpostStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { beregnSats } from './beregnSats'
import { lagTilfeldigBosted } from './bosted'
import { enheter } from './enheter'
import { lagTilfeldigFødselsdato } from './felles'
import { lagTilfeldigFødselsnummer } from './fødselsnumre'
import { lagTilfeldigNavn } from './navn'

const nå = dayjs()
const datoOrdningenStartet = '2022-08-01'

type LagretBarnebrillesak = Omit<Brillesak, 'vilkårsgrunnlag' | 'vilkårsvurdering'>
type LagretVilkårsgrunnlag = Vilkårsgrunnlag
type LagretVilkårsvurdering = Omit<Vilkårsvurdering, 'vilkår'>
type LagretVilkår = Vilkår & { vilkårsvurderingId: number }

function lagVilkårsgrunnlag(sakId: ID | number, vurderVilkårRequest: VurderVilkårRequest): LagretVilkårsgrunnlag {
  return {
    ...vurderVilkårRequest,
    sakId: sakId as string, // fixme
  }
}

function lagVilkårsvurdering(
  sakId: ID | number,
  vurderVilkårRequest: VurderVilkårRequest
): Omit<LagretVilkårsvurdering, 'id'> {
  const { brillepris, brilleseddel } = vurderVilkårRequest
  const { sats, satsBeløp, satsBeskrivelse, beløp } = beregnSats(brilleseddel, brillepris)
  return {
    sakId: sakId as string, // fixme
    resultat: VilkårsResultat.JA,
    sats,
    satsBeløp,
    satsBeskrivelse,
    beløp,
    opprettet: dayjs().toISOString(),
  }
}

function lagVilkår(
  vilkårsvurderingId: number,
  vurderVilkårRequest: VurderVilkårRequest
): Array<Omit<LagretVilkår, 'id'>> {
  const { bestillingsdato, brilleseddel } = vurderVilkårRequest
  return [
    {
      vilkårsvurderingId,
      identifikator: 'Under18ÅrPåBestillingsdato v1',
      beskrivelse: 'Barnet må være under 18 år på bestillingsdato',
      lovReferanse: '§2',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Barnet var under 18 år på bestillingsdato',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        barnetsAlder: '6', // fixme
        bestillingsdato,
      },
    },
    {
      vilkårsvurderingId,
      identifikator: 'MedlemAvFolketrygden v1',
      beskrivelse: 'Medlem av folketrygden',
      lovReferanse: '§2',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§2',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Barnet er antatt medlem i folketrygden basert på folkeregistrert adresse i Norge',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        bestillingsdato,
      },
    },
    {
      vilkårsvurderingId,
      identifikator: 'bestiltHosOptiker',
      beskrivelse: 'Brillen må bestilles hos optiker',
      lovReferanse: '§2',
      lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: VilkårsResultat.JA,
      begrunnelseSaksbehandler: 'test',
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      identifikator: 'komplettBrille',
      beskrivelse: 'Bestillingen inneholder brilleglass',
      lovReferanse: '§2',
      lovdataLenke: 'https://lovdata.no/forskrift/2022-07-19-1364/§2',
      resultatAuto: undefined,
      begrunnelseAuto: undefined,
      resultatSaksbehandler: VilkårsResultat.JA,
      begrunnelseSaksbehandler: 'test',
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      identifikator: 'HarIkkeVedtakIKalenderåret v1',
      beskrivelse: 'Ikke fått støtte til barnebriller tidligere i år - manuelt Hotsak-vedtak',
      lovReferanse: '§3',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§3',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Barnet har ikke vedtak om brille i kalenderåret',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {},
    },
    {
      vilkårsvurderingId,
      identifikator: 'Brillestyrke v1',
      beskrivelse: 'Brillestyrken er innenfor fastsatte styrker',
      lovReferanse: '§4',
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
      identifikator: 'BestillingsdatoTilbakeITid v1',
      beskrivelse: 'Bestillingsdato innenfor 6 siste mnd',
      lovReferanse: '§6',
      lovdataLenke: 'https://lovdata.no/LTI/forskrift/2022-07-19-1364/§6',
      resultatAuto: VilkårsResultat.JA,
      begrunnelseAuto: 'Bestillingsdato er innenfor gyldig periode',
      resultatSaksbehandler: undefined,
      begrunnelseSaksbehandler: undefined,
      grunnlag: {
        bestillingsdato,
        datoOrdningenStartet,
        førsteJournalpostOpprettet: '2023-04-18', // fixme
        lanseringsdatoForManuellInnsending: '2023-03-15',
        første6MndFristForManuelleBarnebrillesøknader: '2023-09-16',
      },
    },
    {
      vilkårsvurderingId,
      identifikator: 'Bestillingsdato v1',
      beskrivelse: 'Bestillingen er gjort etter at loven trådte i kraft',
      lovReferanse: '§13',
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

function lagBarnebrillesak(): Omit<LagretBarnebrillesak, 'sakId'> {
  const fødselsdatoBruker = lagTilfeldigFødselsdato(10)
  return {
    saksinformasjon: {
      opprettet: nå.toISOString(),
    },
    sakstype: Oppgavetype.BARNEBRILLER,
    soknadGjelder: 'Briller til barn',
    bruker: {
      fnr: lagTilfeldigFødselsnummer(fødselsdatoBruker),
      fødselsdato: fødselsdatoBruker.toISODateString(),
      kommune: {
        nummer: '9999',
        navn: lagTilfeldigBosted(),
      },
      kontonummer: '11111111113',
      navn: lagTilfeldigNavn(),
      telefon: '10203040',
    },
    innsender: {
      fnr: lagTilfeldigFødselsnummer(42),
      navn: lagTilfeldigNavn().navn,
    },
    status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    statusEndret: nå.toISOString(),

    steg: StegType.INNHENTE_FAKTA,
    enhet: enheter.oslo,
    journalposter: [],
  }
}

export class BarnebrillesakStore extends Dexie {
  private readonly saker!: Table<LagretBarnebrillesak, number>
  private readonly vilkårsgrunnlag!: Table<LagretVilkårsgrunnlag, number>
  private readonly vilkårsvurderinger!: Table<LagretVilkårsvurdering, number>
  private readonly vilkår!: Table<LagretVilkår, number>

  constructor(
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly journalpostStore: JournalpostStore
  ) {
    super('BarnebrillesakStore')
    if (!window.appSettings.USE_MSW) {
      return
    }
    this.version(1).stores({
      saker: '++sakId',
      vilkårsgrunnlag: '++sakId',
      vilkårsvurderinger: '++id,sakId',
      vilkår: '++id,vilkårsvurderingId',
    })
  }

  async populer() {
    const count = await this.saker.count()
    if (count !== 0) {
      return []
    }
    return this.lagreAlle([
      lagBarnebrillesak(),
      lagBarnebrillesak(),
      lagBarnebrillesak(),
      lagBarnebrillesak(),
      lagBarnebrillesak(),
    ])
  }

  async lagreAlle(saker: Array<Omit<LagretBarnebrillesak, 'sakId'>>) {
    const journalposter = await this.journalpostStore.alle()
    return this.saker.bulkAdd(
      saker.map((sak) => ({
        ...sak,
        journalposter: [journalposter[0].journalpostID],
      })) as any, // fixme
      { allKeys: true }
    )
  }

  async hent(sakId: ID | number): Promise<Brillesak | undefined> {
    sakId = Number(sakId)
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

  async alle() {
    return this.saker.toArray()
  }

  async oppgaver() {
    const saker = await this.alle()
    return saker.map<Oppgave>(({ bruker, ...sak }) => ({
      saksid: sak.sakId,
      sakstype: Oppgavetype.TILSKUDD,
      status: sak.status,
      statusEndret: sak.statusEndret,
      beskrivelse: sak.soknadGjelder,
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

  async tildel(sakId: ID | number) {
    sakId = Number(sakId)
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    await this.saker.update(sakId, {
      saksbehandler: saksbehandler,
      status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
    })
    return true
  }

  async frigi(sakId: ID | number) {
    sakId = Number(sakId)
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }
    await this.saker.update(sakId, {
      saksbehandler: undefined,
      status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
    })
    return true
  }

  async oppdaterSteg(sakId: ID | number, steg: StegType) {
    sakId = Number(sakId)
    return this.saker.update(sakId, {
      steg,
    })
  }

  async oppdaterUtbetalingsmottaker(sakId: ID | number, fnr: string): Promise<Utbetalingsmottaker> {
    sakId = Number(sakId)
    const utbetalingsmottaker: Utbetalingsmottaker = {
      fnr,
      navn: lagTilfeldigNavn().navn,
      kontonummer: '11111111113',
    }
    await this.saker.update(sakId, {
      utbetalingsmottaker,
    })
    return utbetalingsmottaker
  }

  async vurderVilkår(sakId: ID | number, vurderVilkårRequest: VurderVilkårRequest) {
    sakId = Number(sakId)
    return this.transaction('rw', this.saker, this.vilkårsgrunnlag, this.vilkårsvurderinger, this.vilkår, async () => {
      const vilkårsgrunnlag = lagVilkårsgrunnlag(sakId, vurderVilkårRequest)
      await this.vilkårsgrunnlag.put(vilkårsgrunnlag, Number(sakId))
      const vilkårsvurdering = lagVilkårsvurdering(sakId, vurderVilkårRequest)
      const vilkårsvurderingId = await this.vilkårsvurderinger.put(vilkårsvurdering as any) // fixme
      const vilkår = lagVilkår(vilkårsvurderingId, vurderVilkårRequest)
      await this.vilkår.bulkAdd(vilkår as any, { allKeys: true }) // fixme
      return this.oppdaterSteg(sakId, StegType.VURDERE_VILKÅR)
    })
  }

  async oppdaterVilkår(
    sakId: ID | number,
    vilkårId: ID | number,
    { resultatSaksbehandler, begrunnelseSaksbehandler }: OppdaterVilkårRequest
  ) {
    vilkårId = Number(vilkårId)
    return this.vilkår.update(vilkårId, {
      resultatSaksbehandler,
      begrunnelseSaksbehandler,
    })
  }

  async sendTilGodkjenning(sakId: ID | number) {
    sakId = Number(sakId)
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    const totrinnskontroll: Totrinnskontroll = {
      saksbehandler,
      opprettet: dayjs().toISOString(),
    }
    return this.saker.update(sakId, {
      saksbehandler: undefined,
      steg: StegType.GODKJENNE,
      status: OppgaveStatusType.AVVENTER_GODKJENNER,
      totrinnskontroll,
    })
  }

  async ferdigstillTotrinnskontroll(sakId: ID | number, { resultat, begrunnelse }: TotrinnskontrollData) {
    sakId = Number(sakId)
    const nå = dayjs().toISOString()
    const sak = await this.hent(sakId)
    if (!sak || !sak.totrinnskontroll) {
      return Promise.reject('noe gikk galt')
    }

    const lagretTotrinnskontroll = sak.totrinnskontroll
    const godkjenner = await this.saksbehandlerStore.innloggetSaksbehandler()
    if (resultat === 'GODKJENT') {
      const totrinnskontroll: Partial<Totrinnskontroll> = {
        ...lagretTotrinnskontroll,
        godkjenner,
        resultat,
        begrunnelse,
        godkjent: nå,
      }
      return this.saker.update(sakId, {
        saksbehandler: totrinnskontroll.saksbehandler,
        steg: StegType.FERDIG_BEHANDLET,
        status: OppgaveStatusType.VEDTAK_FATTET,
        totrinnskontroll,
      })
    }

    if (resultat === 'RETURNERT') {
      const totrinnskontroll: Partial<Totrinnskontroll> = {
        ...lagretTotrinnskontroll,
        godkjenner,
        resultat,
        begrunnelse,
      }
      return this.saker.update(sakId, {
        saksbehandler: totrinnskontroll.saksbehandler,
        steg: StegType.REVURDERE,
        status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
        totrinnskontroll,
      })
    }

    return 0
  }
}

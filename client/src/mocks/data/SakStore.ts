import Dexie, { Table, UpdateSpec } from 'dexie'

import {
  Barnebrillesak,
  Brevkode,
  BrevTekst,
  JournalføringRequest,
  Kjønn,
  MålformType,
  OppdaterVilkårRequest,
  OppgaveStatusType,
  Sak,
  Saksdokument,
  SaksdokumentType,
  Sakstype,
  StegType,
  Totrinnskontroll,
  TotrinnskontrollData,
  TotrinnskontrollVurdering,
  Utbetalingsmottaker,
  VedtakStatusType,
  VilkårsResultat,
  VurderVilkårRequest,
} from '../../types/types.internal'
import { formaterNavn } from '../../utils/formater'
import { enheter } from './enheter'
import { PersonStore } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { EndreOppgavetildelingRequest } from '../../oppgave/useOppgaveActions.ts'
import {
  erInsertBarnebrillesak,
  erLagretBarnebrillesak,
  InsertBarnebrillesak,
  InsertSak,
  InsertSakshendelse,
  InsertVilkår,
  lagBarnebrillesak,
  lagHjelpemiddelsak,
  LagretBarnebrillesak,
  LagretHjelpemiddelsak,
  LagretSak,
  LagretSakshendelse,
  LagretVilkår,
  LagretVilkårsgrunnlag,
  LagretVilkårsvurdering,
  lagVilkår,
  lagVilkårsgrunnlag,
  lagVilkårsvurdering,
} from './lagSak.ts'
import { JournalpostStore } from './JournalpostStore.ts'
import { lagTilfeldigNavn } from './navn.ts'
import { nåIso } from './felles.ts'
import { OppgaveV1 } from '../../oppgave/oppgaveTypes.ts'

type LagretBrevtekst = BrevTekst
interface LagretSaksdokument extends Saksdokument {
  id: string
}
type InsertSaksdokument = Omit<LagretSaksdokument, 'id'>

export class SakStore extends Dexie {
  private readonly brevtekst!: Table<LagretBrevtekst, string>
  private readonly hendelser!: Table<LagretSakshendelse, number, InsertSakshendelse>
  private readonly saker!: Table<LagretSak, string, InsertSak>
  private readonly saksdokumenter!: Table<LagretSaksdokument, number, InsertSaksdokument>
  private readonly vilkår!: Table<LagretVilkår, number, InsertVilkår>
  private readonly vilkårsgrunnlag!: Table<LagretVilkårsgrunnlag, string>
  private readonly vilkårsvurderinger!: Table<LagretVilkårsvurdering, string>

  constructor(
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly personStore: PersonStore,
    private readonly journalpostStore: JournalpostStore
  ) {
    super('SakStore')
    this.version(1).stores({
      brevtekst: 'sakId',
      hendelser: '++id,sakId',
      saker: 'sakId',
      saksdokumenter: '++id,sakId',
      vilkår: '++id,vilkårsvurderingId',
      vilkårsgrunnlag: 'sakId',
      vilkårsvurderinger: 'id,sakId',
    })
  }

  async populer() {
    const count = await this.saker.count()
    if (count !== 0) {
      return []
    }

    return this.lagreAlle([
      lagHjelpemiddelsak(Sakstype.SØKNAD),
      lagHjelpemiddelsak(Sakstype.SØKNAD),
      lagHjelpemiddelsak(Sakstype.SØKNAD),
      lagHjelpemiddelsak(Sakstype.BESTILLING),
      lagHjelpemiddelsak(Sakstype.BESTILLING),
      lagHjelpemiddelsak(Sakstype.BESTILLING),
      lagBarnebrillesak(),
      lagBarnebrillesak(),
      lagBarnebrillesak(),
    ])
  }

  async lagreAlle(saker: InsertSak[]) {
    const journalposter = await this.journalpostStore.alle()
    await this.personStore.lagreAlle(
      saker.map(({ bruker: { navn, kjønn, ...rest } }) => ({
        ...navn,
        ...rest,
        navn,
        kjønn: kjønn || Kjønn.UKJENT,
        enhet: enheter.agder,
      }))
    )
    return this.saker.bulkAdd(
      saker.map((sak) => {
        if (erInsertBarnebrillesak(sak)) {
          return {
            ...sak,
            journalposter: [journalposter[0].journalpostId],
          }
        }
        return sak
      }),
      { allKeys: true }
    )
  }

  async alle(): Promise<LagretSak[]> {
    return this.saker.toArray()
  }

  async oppgaver(): Promise<OppgaveV1[]> {
    const saker = await this.alle()
    return saker.map<OppgaveV1>(({ bruker, ...sak }) => {
      let sakstype = sak.sakstype
      let funksjonsnedsettelser = ['bevegelse']
      if (sakstype === Sakstype.BARNEBRILLER) {
        sakstype = Sakstype.TILSKUDD
        funksjonsnedsettelser = ['syn']
      }
      const sakId = sak.sakId
      return {
        oppgaveId: `S-${sakId}`,
        versjon: -1,
        sakId,
        sakstype,
        status: sak.status,
        statusEndret: sak.statusEndret,
        beskrivelse: sak.søknadGjelder,
        mottatt: sak.opprettet,
        innsender: formaterNavn(sak.innsender.navn),
        bruker: {
          fnr: bruker.fnr,
          funksjonsnedsettelser,
          bosted: bruker.kommune.navn,
          ...bruker.navn,
        },
        enhet: sak.enhet,
        saksbehandler: sak.saksbehandler,
        kanTildeles: true,
        hast: (sak as LagretHjelpemiddelsak)?.hast,
      }
    })
  }

  async hent(sakId: string): Promise<Sak | Barnebrillesak | undefined> {
    const sak = await this.saker.get(sakId)
    if (!sak) {
      return
    }

    if (erLagretBarnebrillesak(sak)) {
      const vilkårsgrunnlag = await this.vilkårsgrunnlag.get(sak.sakId)
      const vilkårsvurdering = await this.vilkårsvurderinger.where('sakId').equals(sak.sakId).first()
      if (vilkårsvurdering) {
        const vilkår = await this.vilkår.where('vilkårsvurderingId').equals(vilkårsvurdering.id).toArray()
        const { resultat, ...rest } = vilkårsvurdering
        const samletVurdering = this.beregnSamletVurdering(vilkår)
        return {
          ...sak,
          vilkårsgrunnlag,
          vilkårsvurdering: {
            resultat: samletVurdering,
            ...rest,
            vilkår,
          },
        }
      }
      return sak
    }

    return sak
  }

  async lagreHendelse(sakId: string, hendelse: string, detaljer?: string) {
    const { navn: bruker } = await this.saksbehandlerStore.innloggetSaksbehandler()
    return this.hendelser.put({
      opprettet: nåIso(),
      sakId,
      hendelse,
      detaljer,
      bruker,
    })
  }

  async hentHendelser(sakId: string) {
    return this.hendelser.where('sakId').equals(sakId).toArray()
  }

  async tildel(sakId: string, payload: EndreOppgavetildelingRequest = {}): Promise<204 | 404 | 409> {
    const sak = await this.hent(sakId)
    if (!sak) {
      return 404
    }
    if (sak.saksbehandler && !payload.overtaHvisTildelt) {
      return 409
    }

    let saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    if (payload.saksbehandlerId) {
      saksbehandler = await this.saksbehandlerStore.hent(payload.saksbehandlerId)
    }

    this.transaction('rw', this.saker, this.hendelser, () => {
      this.oppdaterSak(sak.sakId, {
        saksbehandler,
        status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
      })
      this.lagreHendelse(sak.sakId, 'Saksbehandler har tatt saken', undefined)
    })

    return 204
  }

  async frigi(sakId: string) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }

    this.transaction('rw', this.saker, this.hendelser, () => {
      this.oppdaterSak(sak.sakId, {
        saksbehandler: undefined,
        status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
      })
      this.lagreHendelse(sak.sakId, 'Saksbehandler er meldt av saken')
    })

    return true
  }

  async oppdaterSteg(sakId: string, steg: StegType) {
    return this.oppdaterSak<LagretBarnebrillesak>(sakId, {
      steg,
    })
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
        this.oppdaterSak(sak.sakId, {
          status: status,
        })
        // this.lagreHendelse(sak.sakId, `Saksstatus endret: ${OppgaveStatusLabel.get(status)}`)
        // this.lagreHendelse(sak.sakId, 'Brev sendt', 'Innhente opplysninger')
      })
      return true
    }
  }

  async oppdaterUtbetalingsmottaker(sakId: string, fnr: string): Promise<Utbetalingsmottaker> {
    const utbetalingsmottaker: Utbetalingsmottaker = {
      fnr,
      navn: lagTilfeldigNavn().fulltNavn,
      kontonummer: '11111111113',
    }

    await this.oppdaterSak<LagretBarnebrillesak>(sakId, {
      utbetalingsmottaker,
    })

    return utbetalingsmottaker
  }

  async vurderVilkår(sakId: string, payload: VurderVilkårRequest) {
    return this.transaction('rw', this.saker, this.vilkårsgrunnlag, this.vilkårsvurderinger, this.vilkår, async () => {
      const vilkårsgrunnlag = lagVilkårsgrunnlag(sakId, payload)

      await this.vilkårsgrunnlag.put(vilkårsgrunnlag, sakId)
      const vilkårsvurdering = lagVilkårsvurdering(sakId, payload)

      const vilkårsvurderingId = await this.vilkårsvurderinger.put(vilkårsvurdering)
      const vilkår = lagVilkår(vilkårsvurderingId, payload)

      vilkårsvurdering.resultat = this.beregnSamletVurdering(vilkår)

      await this.vilkårsvurderinger.update(vilkårsvurderingId, vilkårsvurdering)

      await this.vilkår.where('vilkårsvurderingId').equals(vilkårsvurdering.id).delete()
      await this.vilkår.bulkAdd(vilkår, { allKeys: true })
      await this.oppdaterStatus(sakId, OppgaveStatusType.TILDELT_SAKSBEHANDLER)
      return this.oppdaterSteg(sakId, StegType.VURDERE_VILKÅR)
    })
  }

  // fixme -> se på payload for overstyring av vilkår
  async oppdaterVilkår(vilkårId: string, { resultatSaksbehandler, begrunnelseSaksbehandler }: OppdaterVilkårRequest) {
    return this.vilkår.update(Number(vilkårId), {
      manuellVurdering: {
        vilkårOppfylt: resultatSaksbehandler,
        begrunnelse: begrunnelseSaksbehandler,
      },
      vilkårOppfylt: resultatSaksbehandler,
    })
  }

  async sendTilGodkjenning(sakId: string) {
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    const totrinnskontroll: Totrinnskontroll = {
      saksbehandler,
      opprettet: new Date().toISOString(),
    }

    return this.transaction('rw', this.saker, this.hendelser, () => {
      this.oppdaterSak<LagretBarnebrillesak>(sakId, {
        saksbehandler: undefined,
        steg: StegType.GODKJENNE,
        status: OppgaveStatusType.AVVENTER_GODKJENNER,
        totrinnskontroll,
      })
      this.lagreHendelse(sakId, 'Sak sendt til godkjenning')
    })
  }

  async ferdigstillTotrinnskontroll(sakId: string, { resultat, begrunnelse }: TotrinnskontrollData) {
    const sak = await this.hent(sakId)
    if (!erLagretBarnebrillesak(sak)) {
      return Promise.reject('Bare støtte for totrinnskontroll av barnebrillesaker pt.')
    }

    const lagretTotrinnskontroll = sak.totrinnskontroll
    if (!lagretTotrinnskontroll) {
      return
    }

    const godkjenner = await this.saksbehandlerStore.innloggetSaksbehandler()
    return this.transaction('rw', this.saker, this.hendelser, () => {
      const nå = nåIso()
      if (resultat === TotrinnskontrollVurdering.GODKJENT) {
        const totrinnskontroll: Totrinnskontroll = {
          ...lagretTotrinnskontroll,
          godkjenner,
          resultat,
          begrunnelse,
          godkjent: nå,
        }
        this.oppdaterSak<LagretBarnebrillesak>(sak.sakId, {
          saksbehandler: totrinnskontroll.saksbehandler,
          steg: StegType.FERDIG_BEHANDLET,
          status: OppgaveStatusType.VEDTAK_FATTET,
          vedtak: {
            vedtaksdato: nå,
            status:
              (sak as Barnebrillesak)?.vilkårsvurdering?.resultat === 'JA'
                ? VedtakStatusType.INNVILGET
                : VedtakStatusType.AVSLÅTT,
            saksbehandlerNavn: sak.saksbehandler?.navn || '',
            saksbehandlerRef: sak.saksbehandler?.id || '',
            soknadUuid: '',
          },
          totrinnskontroll,
        })
        this.lagreHendelse(sakId, 'Vedtak fattet')
      }

      if (resultat === TotrinnskontrollVurdering.RETURNERT) {
        const totrinnskontroll: Totrinnskontroll = {
          ...lagretTotrinnskontroll,
          godkjenner,
          resultat,
          begrunnelse,
        }
        this.oppdaterSak<LagretBarnebrillesak>(sak.sakId, {
          saksbehandler: totrinnskontroll.saksbehandler,
          steg: StegType.REVURDERE,
          status: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
          totrinnskontroll,
        })
        this.lagreHendelse(sak.sakId, 'Sak returnert til saksbehandler')
      }
    })
  }

  async opprettSak(journalføring: JournalføringRequest) {
    const sak = lagBarnebrillesak()
    sak.bruker.fnr = journalføring.journalføresPåFnr
    sak.journalposter = [journalføring.journalpostId]
    return this.saker.add(sak)
  }

  async knyttJournalpostTilSak(journalføring: JournalføringRequest) {
    const sakId = journalføring.sakId
    if (!sakId) {
      return
    }

    const eksisterendeSak = await this.hent(sakId)
    if (!erLagretBarnebrillesak(eksisterendeSak)) {
      return
    }

    const eksisterendeJournalposter = eksisterendeSak.journalposter
    this.oppdaterSak<InsertBarnebrillesak>(eksisterendeSak.sakId, {
      journalposter: [...eksisterendeJournalposter, journalføring.journalpostId],
    })
  }

  async lagreBrevtekst(sakId: string, brevtype: string, data: any) {
    this.brevtekst.put({ brevtype, målform: MålformType.BOKMÅL, data: data, sakId }, sakId)
  }

  async fjernBrevtekst(sakId: string) {
    this.brevtekst.delete(sakId)
  }

  async hentBrevtekst(sakId: string) {
    return this.brevtekst.where('sakId').equals(sakId).first()
  }

  async hentSaksdokumenter(sakId: string /*, dokumentType: string */) {
    // fixme -> filterer på dokumenttype også
    return this.saksdokumenter.where('sakId').equals(sakId).toArray()
  }

  async lagreSaksdokument(sakId: string, tittel: string) {
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    const dokumentId = (await this.saksdokumenter.count()) + 1
    this.saksdokumenter.add({
      sakId,
      journalpostId: '123456789',
      type: SaksdokumentType.UTGÅENDE,
      brevkode: Brevkode.INNHENTE_OPPLYSNINGER_BARNEBRILLER,
      opprettet: nåIso(),
      saksbehandler: saksbehandler,
      dokumentId: dokumentId.toString(),
      tittel: tittel,
    })
  }

  async fattVedtak(sakId: string, status: OppgaveStatusType = OppgaveStatusType.VEDTAK_FATTET) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }

    if (sak.status === status) {
      return false
    } else {
      this.transaction('rw', this.saker, this.hendelser, () => {
        this.oppdaterSak(sak.sakId, {
          status: status,
          vedtak: {
            vedtaksdato: nåIso(),
            status: VedtakStatusType.INNVILGET,
            saksbehandlerNavn: sak.saksbehandler?.navn || '',
            saksbehandlerRef: sak.saksbehandler?.id || '',
            soknadUuid: '',
          },
        })
      })
      return true
    }
  }

  private beregnSamletVurdering(vilkår: InsertVilkår[]) {
    const samletVurdering = vilkår
      .map((v) => v.vilkårOppfylt)
      .reduce((samletStatus, vilkårOppfylt) => {
        if (samletStatus === VilkårsResultat.KANSKJE || samletStatus === VilkårsResultat.NEI) {
          return samletStatus
        } else if (vilkårOppfylt === VilkårsResultat.NEI || vilkårOppfylt === VilkårsResultat.KANSKJE) {
          return vilkårOppfylt
        } else if (vilkårOppfylt === VilkårsResultat.OPPLYSNINGER_MANGLER) {
          return VilkårsResultat.NEI
        } else {
          return samletStatus
        }
      }, VilkårsResultat.JA)

    if (!samletVurdering) {
      throw Error('Feil med utledning av samlet status')
    }

    return samletVurdering
  }

  private oppdaterSak<T extends InsertSak = InsertSak>(sakId: string, oppdatering: UpdateSpec<T>) {
    return this.saker.update(sakId, oppdatering)
  }
}

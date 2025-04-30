import Dexie, { Table, UpdateSpec } from 'dexie'

import {
  Barnebrillesak,
  Brevkode,
  BrevTekst,
  Bruker,
  JournalføringRequest,
  Kjønn,
  MålformType,
  OppdaterVilkårRequest,
  Oppgave,
  OppgaveStatusType,
  Sak,
  SakBase,
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
import { IdGenerator } from './IdGenerator'
import { PersonStore } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { EndreOppgavetildelingRequest } from '../../oppgave/OppgaveService.ts'
import {
  erBarnebrillesak,
  lagBarnebrillesak,
  LagretBarnebrillesak,
  LagretSak,
  LagretSakshendelse,
  LagretVilkår,
  LagretVilkårsgrunnlag,
  LagretVilkårsvurdering,
  lagSak,
  lagVilkår,
  lagVilkårsgrunnlag,
  lagVilkårsvurdering,
} from './lagSak.ts'
import { JournalpostStore } from './JournalpostStore.ts'
import { lagTilfeldigNavn } from './navn.ts'
import { Ansatt } from '../../state/authentication.ts'
import { nåIso } from './felles.ts'

export class SakStore extends Dexie {
  private readonly brevtekst!: Table<BrevTekst, string>
  private readonly hendelser!: Table<LagretSakshendelse, string>
  private readonly saker!: Table<LagretSak, string>
  private readonly saksdokumenter!: Table<Saksdokument, string>
  private readonly vilkår!: Table<LagretVilkår, number>
  private readonly vilkårsgrunnlag!: Table<LagretVilkårsgrunnlag, string>
  private readonly vilkårsvurderinger!: Table<LagretVilkårsvurdering, string>

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly personStore: PersonStore,
    private readonly journalpostStore: JournalpostStore
  ) {
    super('SakStore')
    this.version(1).stores({
      brevtekst: 'sakId',
      hendelser: '++id,sakId',
      notater: '++id,sakId',
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
    const lagSakMedId = (
      sakstype: Sakstype.BESTILLING | Sakstype.SØKNAD = Sakstype.SØKNAD,
      overstyringer: {
        bruker?: Partial<Bruker>
      } = {}
    ) => lagSak(this.idGenerator.nesteId(), sakstype, overstyringer)

    const lagBarnebrillesakMedId = () => lagBarnebrillesak(this.idGenerator.nesteId())

    return this.lagreAlle([
      lagSakMedId(),
      lagSakMedId(),
      lagSakMedId(),
      lagSakMedId(Sakstype.SØKNAD),
      lagSakMedId(Sakstype.BESTILLING),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesakMedId(),
      lagBarnebrillesak(3045),
    ])
  }

  async lagreAlle(saker: LagretSak[]) {
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
        if (erBarnebrillesak(sak)) {
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

  oppdaterSak<T extends SakBase = SakBase>(sakId: string, oppdatering: UpdateSpec<T>) {
    return this.saker.update(sakId, oppdatering)
  }

  async alle() {
    return this.saker.toArray()
  }

  async oppgaver() {
    const saker = await this.alle()
    return saker.map<Oppgave>(({ bruker, ...sak }) => {
      let sakstype = sak.sakstype
      let funksjonsnedsettelser = ['bevegelse']
      if (sakstype === Sakstype.BARNEBRILLER) {
        sakstype = Sakstype.TILSKUDD
        funksjonsnedsettelser = ['syn']
      }
      return {
        sakId: sak.sakId,
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
        hast: (sak as Sak)?.hast,
      }
    })
  }

  async hent(sakId: string): Promise<Sak | Barnebrillesak | undefined> {
    const sak = await this.saker.get(sakId)
    if (!sak) {
      return
    }

    if (erBarnebrillesak(sak)) {
      const vilkårsgrunnlag = await this.vilkårsgrunnlag.get(sakId)
      const vilkårsvurdering = await this.vilkårsvurderinger.where('sakId').equals(sakId).first()
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
      id: this.idGenerator.nesteId().toString(),
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

  async tildel(sakId: string, request: EndreOppgavetildelingRequest = {}) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }

    let saksbehandler: Ansatt
    if (request.saksbehandlerId) {
      saksbehandler = await this.saksbehandlerStore.hentAnsatt(request.saksbehandlerId)
    } else {
      saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    }

    this.transaction('rw', this.saker, this.hendelser, () => {
      this.oppdaterSak(sakId, {
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
      this.oppdaterSak(sakId, {
        saksbehandler: undefined,
        status: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
      })
      this.lagreHendelse(sakId, 'Saksbehandler er meldt av saken')
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
        this.oppdaterSak(sakId, {
          status: status,
        })
        // this.lagreHendelse(sakId, `Saksstatus endret: ${OppgaveStatusLabel.get(status)}`)
        // this.lagreHendelse(sakId, 'Brev sendt', 'Innhente opplysninger')
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

  async vurderVilkår(sakId: string, vurderVilkårRequest: VurderVilkårRequest) {
    return this.transaction('rw', this.saker, this.vilkårsgrunnlag, this.vilkårsvurderinger, this.vilkår, async () => {
      const vilkårsgrunnlag = lagVilkårsgrunnlag(sakId, vurderVilkårRequest)

      await this.vilkårsgrunnlag.put(vilkårsgrunnlag, sakId)
      const vilkårsvurdering = lagVilkårsvurdering(sakId, vurderVilkårRequest)

      const vilkårsvurderingId = await this.vilkårsvurderinger.put(vilkårsvurdering)
      const vilkår = lagVilkår(vilkårsvurderingId, vurderVilkårRequest)

      const samletVurdering = this.beregnSamletVurdering(vilkår)
      vilkårsvurdering.resultat = samletVurdering

      await this.vilkårsvurderinger.update(vilkårsvurderingId, vilkårsvurdering)

      await this.vilkår.where('vilkårsvurderingId').equals(vilkårsvurdering.id).delete()
      await this.vilkår.bulkAdd(vilkår as any, { allKeys: true }) // fixme
      await this.oppdaterStatus(sakId, OppgaveStatusType.TILDELT_SAKSBEHANDLER)
      return this.oppdaterSteg(sakId, StegType.VURDERE_VILKÅR)
    })
  }

  // fixme -> se på payload for overstyring av vilkår
  async oppdaterVilkår(
    vilkårId: number | string,
    { resultatSaksbehandler, begrunnelseSaksbehandler }: OppdaterVilkårRequest
  ) {
    vilkårId = Number(vilkårId)

    return this.vilkår.update(vilkårId, {
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
    if (!erBarnebrillesak(sak)) {
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
        this.oppdaterSak<LagretBarnebrillesak>(sakId, {
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
        this.oppdaterSak<LagretBarnebrillesak>(sakId, {
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
    sak.journalposter = [journalføring.journalpostId]
    return this.saker.add(sak)
  }

  async knyttJournalpostTilSak(journalføring: JournalføringRequest) {
    const sakId = journalføring.sakId
    if (!sakId) {
      return
    }

    const eksisterendeSak = await this.saker.get(sakId)
    if (!erBarnebrillesak(eksisterendeSak)) {
      return
    }

    const eksisterendeJournalposter = eksisterendeSak.journalposter
    this.oppdaterSak<LagretBarnebrillesak>(sakId, {
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
      sakId: sakId,
      journalpostId: '12345678',
      type: SaksdokumentType.UTGÅENDE,
      brevkode: Brevkode.INNHENTE_OPPLYSNINGER_BARNEBRILLER,
      opprettet: new Date().toISOString(),
      saksbehandler: saksbehandler,
      dokumentId: dokumentId.toString(),
      tittel: tittel,
    })
  }

  beregnSamletVurdering(vilkår: Array<Omit<LagretVilkår, 'id'>>) {
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

  async fattVedtak(sakId: string, status: OppgaveStatusType, vedtakStatus: VedtakStatusType) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }

    if (sak.status === status) {
      return false
    } else {
      this.transaction('rw', this.saker, this.hendelser, () => {
        this.oppdaterSak(sakId, {
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
}

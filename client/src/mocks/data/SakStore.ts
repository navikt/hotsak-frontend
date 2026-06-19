import Dexie, { Table, UpdateSpec } from 'dexie'

import { isBrevmalBarnebrillerVedtak } from '../../brev/brevSelectors.ts'
import {
  Brev,
  Brevmal,
  Brevstatus,
  Målform,
  type OppdaterBrevutkastRequest,
  type OpprettBrevutkastRequest,
} from '../../brev/brevTyper.ts'
import { type JournalførJournalpostRequest } from '../../journalføring/journalføringTypes.ts'
import { type Saksoversikt } from '../../personoversikt/saksoversiktTypes.ts'
import {
  type Behandling,
  Gjenstående,
  GjenståendeOverfør,
  Henleggelsesårsak,
  type LagreBehandlingRequest,
  UtfallLåst,
  VedtaksResultat,
} from '../../sak/v2/behandling/behandlingTyper.ts'
import { type Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import {
  type Barnebrillesak,
  Brevkode,
  Kjønn,
  type OppdaterVilkårRequest,
  OppgaveStatusType,
  type Sak,
  type Saksdokument,
  SaksdokumentType,
  StegType,
  type Totrinnskontroll,
  type TotrinnskontrollData,
  TotrinnskontrollVurdering,
  type Utbetalingsmottaker,
  VedtakStatusType,
  VilkårsResultat,
  type VurderVilkårRequest,
} from '../../types/types.internal'
import { BehovsmeldingStore } from './BehovsmeldingStore.ts'
import { nåIso } from './felles.ts'
import { JournalpostStore } from './JournalpostStore.ts'
import {
  erInsertBarnebrillesak,
  erLagretBarnebrillesak,
  type InsertBarnebrillesak,
  type InsertSak,
  type InsertSakshendelse,
  lagBarnebrillesak,
  lagHjelpemiddelsakForBehovsmeldingCase,
  type LagretBarnebrillesak,
  type LagretSak,
  type LagretSakshendelse,
} from './lagSak.ts'
import {
  type InsertVilkår,
  type LagretVilkår,
  type LagretVilkårsgrunnlag,
  type LagretVilkårsvurdering,
  lagVilkår,
  lagVilkårsgrunnlag,
  lagVilkårsvurdering,
} from './lagVilkårsvurdering.ts'
import { lagTilfeldigNavn } from './navn.ts'
import { PersonStore } from './PersonStore'
import { Saksbehandlere } from './Saksbehandlere.ts'

interface LagretSaksdokument extends Saksdokument {
  id: string
}

type InsertBehandling = Omit<LagretBehandling, 'behandlingId'>
interface LagretBehandling extends Behandling {
  sakId: string
}
type InsertSaksdokument = Omit<LagretSaksdokument, 'id'>

export class SakStore extends Dexie {
  private readonly brev!: Table<Brev, number, Omit<Brev, 'brevId'>>
  private readonly hendelser!: Table<LagretSakshendelse, number, InsertSakshendelse>
  private readonly saker!: Table<LagretSak, string, InsertSak>
  private readonly saksdokumenter!: Table<LagretSaksdokument, number, InsertSaksdokument>
  private readonly vilkår!: Table<LagretVilkår, number, InsertVilkår>
  private readonly vilkårsgrunnlag!: Table<LagretVilkårsgrunnlag, string>
  private readonly vilkårsvurderinger!: Table<LagretVilkårsvurdering, string>
  private readonly behandlinger!: Table<LagretBehandling, number, InsertBehandling>

  constructor(
    private readonly behovsmeldingStore: BehovsmeldingStore,
    private readonly personStore: PersonStore,
    private readonly journalpostStore: JournalpostStore
  ) {
    super('SakStore')
    this.version(1).stores({
      behandlinger: '++behandlingId,sakId',
      brev: '++brevId,sakId',
      hendelser: '++id,sakId',
      saker: 'sakId,bruker.fnr',
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

    const { default: kommuner } = await import('./kommuner.json')
    // const { default: bydeler } = await import('./bydeler.json')

    const hjelpemiddelsaker = await Promise.all(
      Object.entries(this.behovsmeldingStore.alle).map(async ([behovsmeldingCasePath, loader]) => {
        const behovsmeldingCase = await loader()
        console.log(
          `Oppretter sak for behovsmeldingCasePath: ${behovsmeldingCasePath}, sakId: ${behovsmeldingCase.sakId}`
        )
        return lagHjelpemiddelsakForBehovsmeldingCase(behovsmeldingCasePath, behovsmeldingCase, kommuner)
      })
    )

    return this.lagreAlle([
      ...hjelpemiddelsaker,
      lagBarnebrillesak('1001'),
      lagBarnebrillesak('1002'),
      lagBarnebrillesak('1003'),
      lagBarnebrillesak('1004'),
      lagBarnebrillesak('1005'),
    ])
  }

  async lagreAlle(saker: InsertSak[]) {
    const barnebrilleJournalpostIder = await this.journalpostStore.hentBarnebrilleJournalpostIder()
    let barnebrilleIndex = 0
    await this.personStore.lagreAlle(
      saker.map(({ bruker: { navn, kjønn, ...rest }, enhet }) => ({
        ...navn,
        ...rest,
        navn,
        kjønn: kjønn || Kjønn.UKJENT,
        enhet,
        vergemål: [
          {
            type: 'voksen',
            vergeEllerFullmektig: {
              motpartsPersonident: '30466942398',
              omfang: 'personligeOgOekonomiskeInteresser',
              identifiserendeInformasjon: {
                navn: {
                  fornavn: 'Streng',
                  mellomnavn: undefined,
                  etternavn: 'Malerbukse',
                },
              },
              tjenesteomraade: [
                {
                  tjenesteoppgave: 'hjelpemidler',
                  tjenestevirksomhet: 'nav',
                },
              ],
            },
          },
        ],
      }))
    )
    return this.saker.bulkAdd(
      saker.map((sak) => {
        if (erInsertBarnebrillesak(sak)) {
          const journalpostId = barnebrilleJournalpostIder[barnebrilleIndex % barnebrilleJournalpostIder.length]
          barnebrilleIndex++
          return {
            ...sak,
            journalposter: [journalpostId],
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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async opprettBehandling(sakId: string, request: LagreBehandlingRequest) {
    const erBestilling = request.utfall?.type === 'BESTILLING'
    const gjenstående =
      erBestilling || request.utfall?.utfall === VedtaksResultat.INNVILGET ? [] : [Gjenstående.BREV_MANGLER]

    const behandlingId = await this.behandlinger.put({
      gjenstående: gjenstående,
      utfallLåst: [],
      operasjoner: { overfør: { gjenstående: [] }, angreVedtak: { angringLåst: [] } },
      utfall: request.utfall,
      sakId,
      oppgaveId: request.oppgaveId,
      opprettet: nåIso(),
    })

    return behandlingId
  }

  async lagreBehandling(behandlingId: string | number, request: LagreBehandlingRequest) {
    behandlingId = Number(behandlingId)

    const behandling = await this.behandlinger.get(behandlingId)
    const gjenstående =
      request.utfall?.utfall === VedtaksResultat.INNVILGET ||
      request.utfall?.utfall === Henleggelsesårsak.FEIL_HJELPEMIDDEL ||
      request.utfall?.utfall === Henleggelsesårsak.FLERE_SØKNADER_SAMME_BEHOV ||
      request.utfall?.utfall === Henleggelsesårsak.ANNET ||
      request.utfall?.type === 'OVERFØRING'
        ? []
        : [Gjenstående.BREV_MANGLER]

    this.behandlinger.update(behandlingId, {
      ...behandling,
      utfall: request.utfall,
      gjenstående: request.utfall ? gjenstående : [Gjenstående.UTFALL_MANGLER],
    })

    return behandlingId
  }

  async oppdaterBehandling(behandlingId: number, oppdatertBehandling: Behandling) {
    console.log('Oppdaterer behandling', behandlingId, oppdatertBehandling)

    await this.behandlinger.update(behandlingId, { ...oppdatertBehandling })
  }

  async ferdigstillBehandlingForSak(sakId: string) {
    const behandlinger = await this.hentBehandlinger(sakId)
    const saksbehandler = Saksbehandlere.innlogget()

    if (behandlinger.length > 0) {
      const gjeldendeBehandling = behandlinger[0]
      this.behandlinger.update(gjeldendeBehandling.behandlingId, {
        ...gjeldendeBehandling,
        utfallLåst: [UtfallLåst.FERDIGSTILT],
        ferdigstiltTidspunkt: nåIso(),
        utførtAv: saksbehandler.id,
      })
    }
  }

  async lagreHendelse(sakId: string, hendelse: string, detaljer?: string) {
    const { navn: bruker } = Saksbehandlere.innlogget()
    return this.hendelser.put({
      opprettet: nåIso(),
      sakId,
      hendelse,
      detaljer,
      bruker,
    })
  }

  async hentBehandlinger(sakId: string) {
    return this.behandlinger.where('sakId').equals(sakId).toArray()
  }

  async hentBehandling(behandlingId: number) {
    return this.behandlinger.get(behandlingId)
  }

  async hentHendelser(sakId: string) {
    return this.hendelser.where('sakId').equals(sakId).toArray()
  }

  async tildel(sakId: string): Promise<204 | 404 | 409> {
    const sak = await this.hent(sakId)
    if (!sak) {
      return 404
    }

    // todo -> 409

    this.transaction('rw', this.saker, this.hendelser, () => {
      this.oppdaterSak(sak.sakId, {
        saksstatus: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
      })
      this.lagreHendelse(sak.sakId, 'Saksbehandler har tatt saken', undefined)
    })

    return 204
  }

  async fjernTildeling(sakId: string) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }

    this.transaction('rw', this.saker, this.hendelser, () => {
      this.oppdaterSak(sak.sakId, {
        saksstatus: OppgaveStatusType.AVVENTER_SAKSBEHANDLER,
      })
      this.lagreHendelse(sak.sakId, 'Saksbehandler er meldt av saken')
    })

    return true
  }

  async oppdaterSteg(sakId: string, steg: StegType) {
    if (steg === StegType.FATTE_VEDTAK) {
      const brev = await this.hentBrevForSak(sakId)
      const vedtaksbrev = brev.filter(isBrevmalBarnebrillerVedtak)

      // todo -> bruk riktig brevmal for vedtaksbrev for barnebriller

      if (!vedtaksbrev.length) {
        await this.opprettBrevutkast(sakId, {
          brevutkast: {
            brevmal: Brevmal.BARNEBRILLER_VEDTAK_INNVILGELSE,
            brevmalVersjon: '0',
            målform: Målform.BOKMÅL,
            data: { brevtekst: '' },
          },
        })
      }
    }

    return this.oppdaterSak<LagretBarnebrillesak>(sakId, {
      steg,
    })
  }

  async oppdaterStatus(sakId: string, status: OppgaveStatusType) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }

    if (sak.saksstatus === status) {
      return false
    } else {
      this.transaction('rw', this.saker, () => {
        this.oppdaterSak(sak.sakId, {
          saksstatus: status,
        })
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
    const saksbehandler = Saksbehandlere.innlogget()
    const totrinnskontroll: Totrinnskontroll = {
      saksbehandler,
      opprettet: new Date().toISOString(),
    }

    return this.transaction('rw', this.saker, this.hendelser, () => {
      this.oppdaterSak<LagretBarnebrillesak>(sakId, {
        steg: StegType.GODKJENNE,
        saksstatus: OppgaveStatusType.AVVENTER_GODKJENNER,
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

    const godkjenner = Saksbehandlere.innlogget()
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
          steg: StegType.FERDIG_BEHANDLET,
          saksstatus: OppgaveStatusType.VEDTAK_FATTET,
          vedtak: {
            vedtaksdato: nå,
            vedtaksstatus:
              (sak as Barnebrillesak)?.vilkårsvurdering?.resultat === 'JA'
                ? VedtakStatusType.INNVILGET
                : VedtakStatusType.AVSLÅTT,
            saksbehandlerId: godkjenner.id, // fixme -> i virkeligheten er dette første saksbehandler, ikke godkjenner
            saksbehandlerNavn: godkjenner.navn, // fixme -> i virkeligheten er dette første saksbehandler, ikke godkjenner
            søknadId: '',
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
          steg: StegType.REVURDERE,
          saksstatus: OppgaveStatusType.TILDELT_SAKSBEHANDLER,
          totrinnskontroll,
        })
        this.lagreHendelse(sak.sakId, 'Sak returnert til saksbehandler')
      }
    })
  }

  async opprettSak(journalføring: JournalførJournalpostRequest) {
    const sak = lagBarnebrillesak('') // fixme
    sak.bruker.fnr = journalføring.journalføresPåFnr
    sak.journalposter = [journalføring.journalpostId]
    return this.saker.add(sak)
  }

  async knyttJournalpostTilSak(journalføring: JournalførJournalpostRequest) {
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

  async opprettBrevutkast(sakId: string, request: OpprettBrevutkastRequest): Promise<Brev> {
    const { data = {}, ...rest } = request.brevutkast

    const brevId = await this.brev.add({
      sakId,
      behandlingId: request.behandlingId,
      opprettet: nåIso(),
      opprettetAv: Saksbehandlere.innlogget().id,
      brevstatus: Brevstatus.UTKAST,
      distribusjon: [],
      data,
      ...rest,
    })

    const brev = await this.hentBrev(brevId)
    if (brev.brevmal !== Brevmal.BREVEDITOR_VEDTAKSBREV) {
      return brev
    }

    const behandlingId = Number(request.behandlingId)
    if (behandlingId) {
      const behandling = await this.behandlinger.get(behandlingId)
      if (behandling) {
        await this.behandlinger.update(behandlingId, {
          ...behandling,
          gjenstående: [Gjenstående.BREV_IKKE_FERDIGSTILT],
          utfallLåst: [UtfallLåst.HAR_VEDTAKSBREV],
          operasjoner: {
            ...behandling.operasjoner,
            overfør: {
              gjenstående: [...(behandling.operasjoner.overfør.gjenstående ?? []), GjenståendeOverfør.BREV_MÅ_SLETTES],
            },
          },
        })
      }
    }

    return brev
  }

  async oppdaterBrevutkast(brevId: ID, request: OppdaterBrevutkastRequest): Promise<Brev> {
    brevId = Number(brevId)
    const { data = {}, ...rest } = request.brevutkast

    await this.brev.update(brevId, {
      endret: nåIso(),
      endretAv: Saksbehandlere.innlogget().id,
      data,
      ...rest,
    })

    return this.hentBrev(brevId)
  }

  async slettBrevutkast(brevId: ID): Promise<void> {
    brevId = Number(brevId)
    const brev = await this.hentBrev(brevId)
    this.brev.delete(brevId)
    if (brev.brevmal !== Brevmal.BREVEDITOR_VEDTAKSBREV) {
      return
    }

    const behandlingId = Number(brev.behandlingId)
    if (behandlingId) {
      const behandling = await this.behandlinger.get(behandlingId)
      if (behandling) {
        const gjenståendeOverfør = (behandling.operasjoner.overfør.gjenstående || [])
          .filter((gjenstående) => gjenstående !== GjenståendeOverfør.BREV_MÅ_SLETTES)
          .filter((gjenstående) => gjenstående !== GjenståendeOverfør.BREV_MÅ_ÅPNES_FOR_REDIGERING_OG_SLETTES)

        const angringLåst = behandling.operasjoner.angreVedtak.angringLåst || []
        console.log('Gjenstende ved slett av brev ', gjenståendeOverfør)

        if (behandling.utfall?.utfall === VedtaksResultat.INNVILGET) {
          console.log('Fjerner brevutkast når utfall innvilget')
          await this.behandlinger.update(behandling.behandlingId, {
            ...behandling,
            gjenstående: [],
            utfallLåst: [],
            operasjoner: { overfør: { gjenstående: gjenståendeOverfør }, angreVedtak: { angringLåst } },
          })
        } else {
          await this.behandlinger.update(behandling.behandlingId, {
            ...behandling,
            gjenstående: [Gjenstående.BREV_MANGLER],
            utfallLåst: [],
            operasjoner: { overfør: { gjenstående: gjenståendeOverfør }, angreVedtak: { angringLåst } },
          })
        }
      }
    }
  }

  async ferdigstillBrevutkast(brevId: ID): Promise<Brev> {
    brevId = Number(brevId)

    await this.brev.update(brevId, {
      ferdigstilt: nåIso(),
      ferdigstiltAv: Saksbehandlere.innlogget().id,
      brevstatus: Brevstatus.FERDIGSTILT,
    })

    const brev = await this.hentBrev(brevId)
    if (brev.brevmal === Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER) {
      setTimeout(async () => {
        await this.lagreSaksdokument(brev.sakId, 'Briller til barn: Nav etterspør opplysninger')
      }, 3000)
      return brev
    }
    if (brev.brevmal !== Brevmal.BREVEDITOR_VEDTAKSBREV) {
      return brev
    }

    const behandlingId = Number(brev.behandlingId)
    if (behandlingId) {
      const behandling = await this.behandlinger.get(behandlingId)
      if (behandling) {
        await this.behandlinger.update(behandlingId, {
          ...behandling,
          gjenstående: [],
          operasjoner: {
            overfør: {
              gjenstående: [
                ...(behandling.operasjoner.overfør.gjenstående.filter(
                  (gjenstående) => gjenstående !== GjenståendeOverfør.BREV_MÅ_SLETTES
                ) ?? []),
                GjenståendeOverfør.BREV_MÅ_ÅPNES_FOR_REDIGERING_OG_SLETTES,
              ],
            },
            angreVedtak: {
              angringLåst: [],
            },
          },
        })
      }
    }

    return brev
  }

  async redigerBrevutkast(brevId: ID): Promise<Brev> {
    brevId = Number(brevId)

    await this.brev.update(brevId, {
      endret: nåIso(),
      endretAv: Saksbehandlere.innlogget().id,
      ferdigstilt: undefined,
      ferdigstiltAv: undefined,
      brevstatus: Brevstatus.UTKAST,
    })

    const brev = await this.hentBrev(brevId)
    if (brev.brevmal !== Brevmal.BREVEDITOR_VEDTAKSBREV) {
      return brev
    }

    const behandlingId = Number(brev.behandlingId)
    if (behandlingId) {
      await this.behandlinger.update(behandlingId, {
        gjenstående: [Gjenstående.BREV_IKKE_FERDIGSTILT],
      })
    }

    return brev
  }

  async hentBrev(brevId: ID): Promise<Brev> {
    brevId = Number(brevId)
    const brev = await this.brev.get(brevId)
    if (!brev) {
      throw new Error(`Fant ikke brev med brevId: ${brevId}`)
    }
    return brev
  }

  async hentBrevForSak(sakId: string): Promise<Brev[]> {
    return this.brev.where('sakId').equals(sakId).toArray()
  }

  async hentSaksdokumenter(sakId: string) {
    return this.saksdokumenter.where('sakId').equals(sakId).toArray()
  }

  async lagreSaksdokument(sakId: string, tittel: string) {
    const saksbehandler = Saksbehandlere.innlogget()
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

  async fattVedtak(
    sakId: string,
    status: OppgaveStatusType = OppgaveStatusType.VEDTAK_FATTET,
    vedtaksResultat?: VedtaksResultat
  ) {
    const sak = await this.hent(sakId)
    if (!sak) {
      return false
    }

    const vedtakStatus = utledVedtakStatus(vedtaksResultat)

    if (sak.saksstatus === status) {
      return false
    } else {
      const saksbehandler = Saksbehandlere.innlogget()
      this.transaction('rw', this.saker, this.hendelser, () => {
        this.oppdaterSak(sak.sakId, {
          saksstatus: status,
          vedtak: {
            vedtaksdato: nåIso(),
            vedtaksstatus: vedtakStatus || VedtakStatusType.INNVILGET,
            saksbehandlerId: saksbehandler.id,
            saksbehandlerNavn: saksbehandler.navn,
            søknadId: '',
          },
        })
      })
      this.lagreHendelse(sakId, 'Varsel til bruker', 'EPOST: «Vedtak fra Nav» sendt til test@nav.no')
      this.lagreHendelse(
        sakId,
        'Vedtaksbrev sendt til bruker',
        'Brevet er sendt som fysisk post (sentral utskrift) til Herfindalsfjellet 37\n5725 VAKSDAL'
      )
      return true
    }
  }

  async saksoversikt(fnr: string): Promise<Saksoversikt> {
    const saker = await this.saker.where('bruker.fnr').equals(fnr).toArray()
    return {
      saker: saker.map((sak) => ({
        sakId: sak.sakId,
        sakstype: sak.sakstype,
        saksstatus: sak.saksstatus,
        saksstatusGyldigFra: sak.saksstatusGyldigFra,
        område: [],
        mottattTidspunkt: sak.opprettet,
        gjelder: sak.søknadGjelder,
        behandletAv: Saksbehandlere.default.navn, // fixme -> bruk behandling
        behandlingsutfall: sak.vedtak?.vedtaksstatus, // fixme -> bruk behandling
        behandlingsutfallTidspunkt: sak.vedtak?.vedtaksdato, // fixme -> bruk behandling
        fagsaksystem: 'HOTSAK',
      })),
      barnebrillekrav: [],
      barnebrillekravHentet: true,
    }
  }

  async hentBehovsmelding(sakId: string): Promise<Innsenderbehovsmelding | undefined> {
    const sak = await this.hent(sakId)
    if (!sak) return
    const behovsmeldingCase = await this.behovsmeldingStore.hentForSak(sak)
    return behovsmeldingCase?.behovsmelding
  }

  private beregnSamletVurdering(vilkår: InsertVilkår[]) {
    const samletVurdering = vilkår
      .map((it) => it.vilkårOppfylt)
      .reduce((samletStatus, vilkårOppfylt) => {
        if (samletStatus === VilkårsResultat.KANSKJE || samletStatus === VilkårsResultat.NEI) {
          return samletStatus
        } else if (vilkårOppfylt === VilkårsResultat.KANSKJE || vilkårOppfylt === VilkårsResultat.NEI) {
          return vilkårOppfylt
        } else if (vilkårOppfylt === VilkårsResultat.OPPLYSNINGER_MANGLER) {
          return VilkårsResultat.NEI
        } else {
          return samletStatus
        }
      }, VilkårsResultat.JA)

    if (!samletVurdering) {
      throw Error('Feil med utledning av samlet vurdering')
    }

    return samletVurdering
  }

  private oppdaterSak<T extends InsertSak = InsertSak>(sakId: string, oppdatering: UpdateSpec<T>) {
    return this.saker.update(sakId, oppdatering)
  }
}

// TODO unødvendig mapping? Typene kan kanskje slås sammen hvis de er og kommer til å være like
function utledVedtakStatus(vedtaksResultat?: VedtaksResultat): VedtakStatusType {
  switch (vedtaksResultat) {
    case VedtaksResultat.INNVILGET:
      return VedtakStatusType.INNVILGET
    case VedtaksResultat.AVSLÅTT:
      return VedtakStatusType.AVSLÅTT
    case VedtaksResultat.DELVIS_INNVILGET:
      return VedtakStatusType.DELVIS_INNVILGET
    default:
      return VedtakStatusType.INNVILGET
  }
}

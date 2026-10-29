import { Box, Button, InfoCard } from '@navikt/ds-react'
import { type ReactNode, Suspense, useEffect, useState } from 'react'

import { Tekst, TextContainer } from '../felleskomponenter/typografi.tsx'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { useBehandling } from '../sak/v2/behandling/useBehandling.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { formaterTidsstempel } from '../utils/dato.ts'
import { useMiljø } from '../utils/useMiljø.ts'
import { AngreSendingAvBrevDialog } from './AngreSendingAvBrevDialog.tsx'
import { BrevContext } from './BrevContext.ts'
import { type BreveditorBrevdata, isBreveditorState } from './breveditor/breveditorTyper.ts'
import { type PlaceholderFeil, validerPlaceholders } from './breveditor/plugins/placeholder/PlaceholderFeil.ts'
import { BrevForhåndsvisning } from './BrevForhåndsvisning.tsx'
import { BrevHeader } from './BrevHeader.tsx'
import classes from './BrevPanel.module.css'
import { BrevRedigering } from './BrevRedigering.tsx'
import { type Brev, BreveditorbrevUtenVedtak, Brevmal, Brevstatus, isBreveditorbrevUtenVedtak } from './brevTyper.ts'
import { NyttBrev } from './NyttBrev.tsx'
import { SendBrevDialog } from './SendBrevDialog.tsx'
import { SlettBrevModal } from './SlettBrevModal.tsx'
import { useBrev } from './useBrev.ts'
import { useBrevActions } from './useBrevActions.ts'

export interface BrevPanelProps {
  oppgave?: Saksbehandlingsoppgave
  brev: Brev[]
  initialBrevId?: string
}

export function BrevPanel({ oppgave, brev, initialBrevId }: BrevPanelProps) {
  const { sak } = useSak()
  const { erIkkeProd } = useMiljø()
  const { gjeldendeBehandling } = useBehandling()
  const { oppgaveErAvsluttet, oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const [valgtBrevId, setValgtBrevId] = useState<string | null | undefined>(initialBrevId)
  const [sendBrevDialogOpen, setSendBrevDialogOpen] = useState(false)
  const [slettBrevModalOpen, setSlettBrevModalOpen] = useState(false)
  const [angreSendingAvBrevDialogOpen, setAngreSendingAvBrevDialogOpen] = useState(false)
  const [placeholderFeil, setPlaceholderFeil] = useState<PlaceholderFeil[]>([])
  const [synligKryssKnapp, setSynligKryssKnapp] = useState(false)
  const [nå, setNå] = useState(Date.now)

  const aktivtBrevId = valgtBrevId === undefined ? initialBrevId : (valgtBrevId ?? undefined)
  const valgtBrev = brev.find((brev) => brev.brevId === aktivtBrevId)
  const { brev: brevMedData } = useBrev<BreveditorBrevdata>(valgtBrev?.brevId)
  const { ferdigstillBrevutkast, redigerBrevutkast, slettBrevutkast } = useBrevActions(oppgave, valgtBrev?.brevId)

  const eksisterendeBrevmaler = new Set(brev.map((brev) => brev.brevmal))
  const tilgjengeligeBrevmaler = BreveditorbrevUtenVedtak.filter((brevmal) => !eksisterendeBrevmaler.has(brevmal))

  const aktivDistribusjon = valgtBrev?.distribusjon.find(
    (distribusjon) => distribusjon.skalDistribueres && !distribusjon.distribuert
  )
  const erDistribuert = valgtBrev?.distribusjon.some((distribusjon) => distribusjon.distribuert) ?? false
  const underveisbrevDistribueresEtter = aktivDistribusjon?.distribueresEtter
  const harAktivDistribusjon = aktivDistribusjon !== undefined
  const distribusjonstidspunkt = underveisbrevDistribueresEtter
    ? Date.parse(underveisbrevDistribueresEtter)
    : Number.NaN
  const harGyldigDistribusjonstidspunkt = Number.isFinite(distribusjonstidspunkt)
  const gyldigDistribueresEtter = harGyldigDistribusjonstidspunkt ? underveisbrevDistribueresEtter : undefined

  const kanAngreBrev =
    harAktivDistribusjon &&
    harGyldigDistribusjonstidspunkt &&
    distribusjonstidspunkt > nå &&
    !oppgaveErAvsluttet &&
    oppgaveErUnderBehandlingAvInnloggetAnsatt

  const kanRedigere =
    !!valgtBrev &&
    !harAktivDistribusjon &&
    !oppgaveErAvsluttet &&
    [Brevstatus.UTKAST, Brevstatus.FERDIGSTILT].some((status) => status === valgtBrev.brevstatus) &&
    oppgaveErUnderBehandlingAvInnloggetAnsatt

  const sendesMedBehandling = valgtBrev?.brevmal === Brevmal.BREVEDITOR_VEDTAKSBREV
  const brevUtenVedtak = valgtBrev?.brevmal !== undefined && isBreveditorbrevUtenVedtak(valgtBrev.brevmal)

  useEffect(() => {
    if (initialBrevId) {
      setPlaceholderFeil([])
      setSynligKryssKnapp(false)
      setValgtBrevId(initialBrevId)
    }
  }, [initialBrevId])

  useEffect(() => {
    if (!underveisbrevDistribueresEtter) return

    const frist = Date.parse(underveisbrevDistribueresEtter)
    if (!Number.isFinite(frist)) return

    const timeoutId = window.setTimeout(() => setNå(Date.now()), Math.max(0, frist - Date.now()))

    return () => window.clearTimeout(timeoutId)
  }, [underveisbrevDistribueresEtter])

  const handleVelgBrev = (brevId: string) => {
    setPlaceholderFeil([])
    setSynligKryssKnapp(false)
    setValgtBrevId(brevId)
  }

  const handleFerdigstill = async () => {
    setSynligKryssKnapp(true)
    const editorState = brevMedData && isBreveditorState(brevMedData.data) ? brevMedData.data.value : undefined
    if (!editorState) return

    const feil = validerPlaceholders(editorState)
    setPlaceholderFeil(feil)
    if (feil.length > 0) return

    await ferdigstillBrevutkast.trigger()
  }

  const handleRediger = async () => {
    setPlaceholderFeil([])
    await redigerBrevutkast.trigger()
  }

  const handleSlettBrev = async () => {
    if (!valgtBrev) return
    await slettBrevutkast.trigger()
    setSlettBrevModalOpen(false)
    setValgtBrevId(brev.find((b) => b.brevId !== valgtBrev.brevId)?.brevId ?? null)
  }

  const handlinger = valgtBrev && (
    <>
      {kanAngreBrev && brevUtenVedtak && erIkkeProd && (
        <Button variant="secondary" size="small" onClick={() => setAngreSendingAvBrevDialogOpen(true)}>
          Angre sending
        </Button>
      )}
      {kanRedigere && !valgtBrev.ferdigstilt && (
        <Button variant="tertiary" size="small" onClick={() => setSlettBrevModalOpen(true)}>
          Slett utkast
        </Button>
      )}
      {kanRedigere && valgtBrev.ferdigstilt && (
        <Button variant="tertiary" size="small" loading={redigerBrevutkast.isMutating} onClick={handleRediger}>
          Rediger
        </Button>
      )}
      {kanRedigere && !valgtBrev.ferdigstilt && (
        <Button variant="primary" size="small" loading={ferdigstillBrevutkast.isMutating} onClick={handleFerdigstill}>
          {sendesMedBehandling ? 'Ferdigstill utkast' : 'Ferdigstill og forhåndsvis'}
        </Button>
      )}
      {kanRedigere && valgtBrev.ferdigstilt && brevUtenVedtak && (
        <Button variant="primary" size="small" onClick={() => setSendBrevDialogOpen(true)}>
          Send brev
        </Button>
      )}
    </>
  )

  return (
    <BrevContext
      value={{
        placeholderFeil,
        setPlaceholderFeil,
        synligKryssKnapp,
        setSynligKryssKnapp,
        datoSoknadMottatt: sak?.data.søknadMottatt,
        hjelpemidlerSøktOm: hjelpemidlerSøktOm(sak?.data.søknadGjelder),
      }}
    >
      <div className={classes.panel}>
        <div className={classes.header}>
          <BrevHeader
            brev={brev}
            valgtBrevId={aktivtBrevId}
            onVelgBrev={handleVelgBrev}
            kanRedigere={kanRedigere}
            handlinger={handlinger}
          />
        </div>
        {!valgtBrev && valgtBrevId != 'nytt-utkast' && (
          <Box paddingInline="space-20">
            <BrevInfoCard title="Ingen brev valgt">
              {brev.length === 0 ? 'Det er ikke opprettet noen brev i saken.' : 'Velg et brev i fanene over.'}
            </BrevInfoCard>
          </Box>
        )}
        {!valgtBrev && valgtBrevId == 'nytt-utkast' && (
          <>
            {oppgave && (
              <NyttBrev
                oppgave={oppgave}
                tilgjengeligeBrevmaler={tilgjengeligeBrevmaler}
                onOpprettet={(opprettetBrev) => {
                  handleVelgBrev(opprettetBrev.brevId)
                }}
              />
            )}
          </>
        )}
        {valgtBrev && kanRedigere && oppgave && (
          <Box className={classes.container} background="default">
            <Suspense>
              <BrevRedigering oppgave={oppgave} behandling={gjeldendeBehandling} brevId={valgtBrev.brevId} />
            </Suspense>
          </Box>
        )}
        {valgtBrev && !(kanRedigere && oppgave) && (
          <div className={classes.innhold}>
            <Box paddingInline="space-20" paddingBlock="space-0 space-20">
              {oppgaveErAvsluttet && (
                <BrevInfoCard title="Oppgaven er ferdigstilt">
                  Denne oppgaven er ferdigstilt. Du kan ikke lenger redigere brevet.
                </BrevInfoCard>
              )}
              {gyldigDistribueresEtter && !erDistribuert && (
                <BrevInfoCard title="Brev til distribusjon">
                  Brevet ligger til distribusjon, og vil sendes automatisk den{' '}
                  {formaterTidsstempel(gyldigDistribueresEtter)}.
                </BrevInfoCard>
              )}
              {erDistribuert && valgtBrev.distribusjon[0].distribueresEtter && (
                <BrevInfoCard title="Brev til distribusjon">
                  Brevet er distribuert og ble sendt den{' '}
                  {formaterTidsstempel(valgtBrev.distribusjon[0].distribueresEtter)}.
                </BrevInfoCard>
              )}
            </Box>
            <BrevForhåndsvisning brevId={valgtBrev.brevId} avsluttet={oppgaveErAvsluttet} />
          </div>
        )}
        {valgtBrev && oppgave && (
          <SendBrevDialog
            oppgave={oppgave}
            brevId={valgtBrev.brevId}
            open={sendBrevDialogOpen}
            onClose={() => setSendBrevDialogOpen(false)}
          />
        )}
        {valgtBrev && (
          <AngreSendingAvBrevDialog
            oppgave={oppgave}
            brevId={valgtBrev.brevId}
            open={angreSendingAvBrevDialogOpen}
            onClose={() => setAngreSendingAvBrevDialogOpen(false)}
            distribueresEtter={gyldigDistribueresEtter}
          />
        )}
        <SlettBrevModal
          heading="Vil du slette brevutkastet?"
          tekst="Du er i ferd med å slette brevutkastet. Dette kan ikke angres."
          width="700px"
          loading={slettBrevutkast.isMutating}
          open={slettBrevModalOpen}
          onClose={() => setSlettBrevModalOpen(false)}
          onBekreft={handleSlettBrev}
        />
      </div>
    </BrevContext>
  )
}

function hjelpemidlerSøktOm(søknadGjelder?: string): string[] | undefined {
  return søknadGjelder
    ?.replace(/^Søknad om:\s*/i, '')
    .split(',')
    .map((h) => h.trim())
}

function BrevInfoCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <TextContainer>
      <InfoCard data-color="info" size="small">
        <InfoCard.Header>
          <InfoCard.Title>{title}</InfoCard.Title>
        </InfoCard.Header>
        <InfoCard.Content>
          <Tekst>{children}</Tekst>
        </InfoCard.Content>
      </InfoCard>
    </TextContainer>
  )
}

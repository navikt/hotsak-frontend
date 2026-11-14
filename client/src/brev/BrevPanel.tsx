import { Box, Button, InfoCard, VStack } from '@navikt/ds-react'
import { type ReactNode, Suspense, useEffect, useRef, useState } from 'react'

import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { Tekst, TextContainer } from '../felleskomponenter/typografi.tsx'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { useBehandling } from '../sak/behandling/useBehandling.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { formaterTidsstempel } from '../utils/dato.ts'
import { useMiljø } from '../utils/useMiljø.ts'
import { AngreSendingAvBrevDialog } from './AngreSendingAvBrevDialog.tsx'
import { BrevContext } from './BrevContext.ts'
import { BreveditorBrevdata, isBreveditorState } from './breveditor/breveditorTyper.ts'
import { PlaceholderFeil, validerPlaceholders } from './breveditor/plugins/placeholder/PlaceholderFeil.ts'
import { BrevForhåndsvisning } from './BrevForhåndsvisning.tsx'
import { BrevHeader } from './BrevHeader.tsx'
import classes from './BrevPanel.module.css'
import { BrevRedigering } from './BrevRedigering.tsx'
import { type Brev, Brevmal, Brevstatus, isBreveditorbrevUtenVedtak } from './brevTyper.ts'
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
  const flushLagringRef = useRef<(() => Promise<void>) | undefined>(undefined)
  const bytterBrevRef = useRef(false)
  const { showErrorToast } = useToast()

  const aktivtBrevId = valgtBrevId === undefined ? initialBrevId : (valgtBrevId ?? undefined)
  const valgtBrev = brev.find((brev) => brev.brevId === aktivtBrevId)
  const { brev: brevMedData } = useBrev<BreveditorBrevdata>(valgtBrev?.brevId)
  const { ferdigstillBrevutkast, redigerBrevutkast, slettBrevutkast } = useBrevActions(oppgave, valgtBrev?.brevId)

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

  const kanAngreBrev = valgtBrev?.kanAngreBrev && !oppgaveErAvsluttet && oppgaveErUnderBehandlingAvInnloggetAnsatt

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

  const handleVelgBrev = async (brevId: string) => {
    if (bytterBrevRef.current || brevId === aktivtBrevId) return
    bytterBrevRef.current = true
    try {
      await flushLagringRef.current?.()
      setPlaceholderFeil([])
      setSynligKryssKnapp(false)
      setValgtBrevId(brevId)
    } catch {
      showErrorToast('Kunne ikke lagre brevet. Prøv å bytte fane igjen.')
    } finally {
      bytterBrevRef.current = false
    }
  }

  const validerBrev = () => {
    setSynligKryssKnapp(true)
    const editorState = brevMedData && isBreveditorState(brevMedData.data) ? brevMedData.data.value : undefined
    if (!editorState) return false

    const feil = validerPlaceholders(editorState)
    setPlaceholderFeil(feil)
    return feil.length === 0
  }

  const handleFerdigstill = async () => {
    if (!validerBrev()) return
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

  const handleForhåndsvis = async () => {
    try {
      await flushLagringRef.current?.()
      await ferdigstillBrevutkast.trigger()
    } catch {
      showErrorToast('Kunne ikke forhåndsvise brevet.')
    }
  }

  const handleSendBrev = async () => {
    try {
      await flushLagringRef.current?.()
      if (!validerBrev()) {
        if (valgtBrev?.ferdigstilt) await redigerBrevutkast.trigger()
        return
      }
      setSendBrevDialogOpen(true)
    } catch {
      showErrorToast('Kunne ikke lagre brevet.')
    }
  }

  const handlinger = valgtBrev && (
    <>
      {kanAngreBrev && brevUtenVedtak && erIkkeProd && (
        <Button variant="secondary" size="small" onClick={() => setAngreSendingAvBrevDialogOpen(true)}>
          Angre sending
        </Button>
      )}
      {kanRedigere && valgtBrev.ferdigstilt && (
        <Button variant="tertiary" size="small" loading={redigerBrevutkast.isMutating} onClick={handleRediger}>
          Rediger
        </Button>
      )}
      {kanRedigere && !valgtBrev.ferdigstilt && sendesMedBehandling && (
        <Button variant="primary" size="small" loading={ferdigstillBrevutkast.isMutating} onClick={handleFerdigstill}>
          Ferdigstill utkast
        </Button>
      )}
      {kanRedigere && !valgtBrev.ferdigstilt && brevUtenVedtak && (
        <Button variant="secondary" size="small" loading={ferdigstillBrevutkast.isMutating} onClick={handleForhåndsvis}>
          Forhåndsvis
        </Button>
      )}
      {kanRedigere && brevUtenVedtak && (
        <Button variant="primary" size="small" onClick={handleSendBrev}>
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
        flushLagringRef,
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
            onSlettUtkast={
              kanRedigere && valgtBrev && !valgtBrev.ferdigstilt ? () => setSlettBrevModalOpen(true) : undefined
            }
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
              <BrevRedigering
                key={valgtBrev.brevId}
                oppgave={oppgave}
                behandling={gjeldendeBehandling}
                brevId={valgtBrev.brevId}
              />
            </Suspense>
          </Box>
        )}
        {valgtBrev && !(kanRedigere && oppgave) && (
          <div className={classes.innhold}>
            <Box paddingInline="space-20" paddingBlock="space-0 space-20">
              <VStack gap="space-4">
                {oppgaveErAvsluttet && (
                  <BrevInfoCard title="Oppgaven er ferdigstilt">
                    Denne oppgaven er ferdigstilt. Du kan ikke lenger redigere brevet.
                  </BrevInfoCard>
                )}
                {gyldigDistribueresEtter && !erDistribuert && (
                  <BrevInfoCard title="Brev til distribusjon">
                    Brevet ligger til distribusjon, og distribusjonen vil starte den{' '}
                    {formaterTidsstempel(gyldigDistribueresEtter)}.
                  </BrevInfoCard>
                )}
                {erDistribuert && (
                  <BrevInfoCard title="Brev er distribuert">
                    Brevet er distribuert og ble sendt den{' '}
                    {formaterTidsstempel(
                      valgtBrev.distribusjon.find((distribusjon) => distribusjon.distribuert)?.distribuert
                    )}
                    .
                  </BrevInfoCard>
                )}
              </VStack>
            </Box>
            <BrevForhåndsvisning brevId={valgtBrev.brevId} avsluttet={oppgaveErAvsluttet} />
          </div>
        )}
        {valgtBrev && oppgave && sendBrevDialogOpen && (
          <SendBrevDialog
            oppgave={oppgave}
            brev={valgtBrev}
            open={sendBrevDialogOpen}
            onClose={() => setSendBrevDialogOpen(false)}
          />
        )}
        {valgtBrev && angreSendingAvBrevDialogOpen && (
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

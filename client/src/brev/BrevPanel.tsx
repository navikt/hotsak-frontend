import { Box, Button, HStack, InfoCard, Tooltip, VStack } from '@navikt/ds-react'
import { type ReactNode, Suspense, useState } from 'react'

import { PanelTittel } from '../felleskomponenter/panel/PanelTittel.tsx'
import { Tekst, TextContainer } from '../felleskomponenter/typografi.tsx'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { useBehandling } from '../sak/v2/behandling/useBehandling.ts'
import { useClosePanel } from '../sak/v2/paneler/usePanelHooks.ts'
import { formaterDato } from '../utils/dato.ts'
import { BrevForhåndsvisning } from './BrevForhåndsvisning.tsx'
import classes from './BrevPanel.module.css'
import { BrevRedigering } from './BrevRedigering.tsx'
import { type Brev, BreveditorbrevUtenVedtak, Brevmal, BrevmalTekst, Brevstatus, brevstatusTekst } from './brevTyper.ts'
import { NyttBrevDialog } from './NyttBrevDialog.tsx'
import { EnvelopeClosedIcon } from '@navikt/aksel-icons'

export interface BrevPanelProps {
  oppgave?: Saksbehandlingsoppgave
  brev: Brev[]
  initialBrevId?: string
}

export function BrevPanel({ oppgave, brev, initialBrevId }: BrevPanelProps) {
  const { gjeldendeBehandling } = useBehandling()
  const { oppgaveErAvsluttet, oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const [valgtBrevId, setValgtBrevId] = useState<string | null | undefined>(initialBrevId)
  const [nyttBrevDialogOpen, setNyttBrevDialogOpen] = useState(false)
  const aktivtBrevId = valgtBrevId === undefined ? initialBrevId : valgtBrevId
  const valgtBrev = brev.find((brev) => brev.brevId === aktivtBrevId)
  const eksisterendeBrevmaler = new Set(brev.map((brev) => brev.brevmal))
  const tilgjengeligeBrevmaler = BreveditorbrevUtenVedtak.filter((brevmal) => !eksisterendeBrevmaler.has(brevmal))
  const kanOppretteBrev =
    !!oppgave && !oppgaveErAvsluttet && oppgaveErUnderBehandlingAvInnloggetAnsatt && tilgjengeligeBrevmaler.length > 0

  if (valgtBrev) {
    const tilbakeTilOversikt = () => setValgtBrevId(null)
    const kanRedigere =
      !oppgaveErAvsluttet &&
      [Brevstatus.UTKAST, Brevstatus.FERDIGSTILT].some((status) => status === valgtBrev.brevstatus) &&
      oppgaveErUnderBehandlingAvInnloggetAnsatt

    if (kanRedigere && oppgave) {
      return (
        <Box className={classes.container} background="default">
          <Suspense>
            <BrevRedigering
              oppgave={oppgave}
              behandling={gjeldendeBehandling}
              brevId={valgtBrev.brevId}
              onSlettBrev={tilbakeTilOversikt}
              onTilbake={tilbakeTilOversikt}
            />
          </Suspense>
        </Box>
      )
    }

    return (
      <BrevPanelLayout tittel={BrevmalTekst[valgtBrev.brevmal]} onTilbake={tilbakeTilOversikt}>
        {oppgaveErAvsluttet && (
          <BrevInfoCard title="Oppgaven er ferdigstilt">
            Denne oppgaven er ferdigstilt. Du kan ikke lenger redigere brevet.
          </BrevInfoCard>
        )}
        <BrevForhåndsvisning brevId={valgtBrev.brevId} avsluttet={oppgaveErAvsluttet} />
      </BrevPanelLayout>
    )
  }

  return (
    <>
      <BrevPanelLayout onNyttBrev={kanOppretteBrev ? () => setNyttBrevDialogOpen(true) : undefined}>
        {brev.length === 0 ? (
          <BrevInfoCard title="Ingen brev">Det er ikke opprettet noen brev i saken.</BrevInfoCard>
        ) : (
          <VStack gap="space-8">
            {brev.map((brev) => (
              <Button key={brev.brevId} variant="tertiary" onClick={() => setValgtBrevId(brev.brevId)}>
                <HStack gap="space-2" paddingInline="space-8" align="center">
                  {BrevmalTekst[brev.brevmal]} - {brevstatusTekst(brev.brevstatus)} ({formaterDato(brev.opprettet)})
                  <Tooltip
                    content={
                      brev.brevmal === Brevmal.BREVEDITOR_VEDTAKSBREV
                        ? 'Vedtaksbrevet sendes ut automatisk etter du har fatted et vedtak'
                        : 'Brevet sendes ut manuelt ved at du trykker på "Send brev" når du står inne på det ferdigstilte brevet'
                    }
                  >
                    <EnvelopeClosedIcon title="a11y-title" fontSize="1.5rem" />
                  </Tooltip>
                </HStack>
              </Button>
            ))}
          </VStack>
        )}
      </BrevPanelLayout>
      {oppgave && (
        <NyttBrevDialog
          open={nyttBrevDialogOpen}
          oppgave={oppgave}
          tilgjengeligeBrevmaler={tilgjengeligeBrevmaler}
          onClose={() => setNyttBrevDialogOpen(false)}
          onOpprettet={(opprettetBrev) => {
            setNyttBrevDialogOpen(false)
            setValgtBrevId(opprettetBrev.brevId)
          }}
        />
      )}
    </>
  )
}

function BrevPanelLayout({
  tittel = 'Brev',
  onNyttBrev,
  onTilbake,
  children,
}: {
  tittel?: string
  onNyttBrev?: () => void
  onTilbake?: () => void
  children: ReactNode
}) {
  const closePanel = useClosePanel('brevpanel')
  return (
    <Box className={classes.container} background="default">
      <VStack paddingInline="space-20" gap="space-16" height="100%">
        <PanelTittel
          paddingInline="space-8 space-0"
          tittel={tittel}
          handlinger={
            onNyttBrev ? (
              <Button size="small" onClick={onNyttBrev}>
                Nytt brev
              </Button>
            ) : onTilbake ? (
              <Button size="small" variant="tertiary" onClick={onTilbake}>
                Alle brev
              </Button>
            ) : undefined
          }
          lukkPanel={closePanel}
        />
        {children}
      </VStack>
    </Box>
  )
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

import { Box, InfoCard, VStack } from '@navikt/ds-react'
import { Suspense, type ReactNode } from 'react'

import { PanelTittel } from '../felleskomponenter/panel/PanelTittel.tsx'
import { Tekst, TextContainer } from '../felleskomponenter/typografi.tsx'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { useBehandling } from '../sak/v2/behandling/useBehandling.ts'
import { useClosePanel } from '../sak/v2/paneler/usePanelHooks.ts'
import { BrevForhåndsvisning } from './BrevForhåndsvisning.tsx'
import classes from './BrevPanel.module.css'
import { BrevRedigering } from './BrevRedigering.tsx'
import { type Brev } from './brevTyper.ts'

export interface BrevPanelProps {
  oppgave?: Saksbehandlingsoppgave
  brev?: Brev
}

export function BrevPanel({ oppgave, brev }: BrevPanelProps) {
  const { gjeldendeBehandling } = useBehandling()
  const { oppgaveErAvsluttet } = useOppgaveregler(oppgave)
  if (oppgaveErAvsluttet || brev?.distribusjon.length) {
    return (
      <BrevPanelLayout tittel="Vedtaksbrev">
        <BrevInfoCard title="Oppgaven er ferdigstilt">
          Denne oppgaven er ferdigstilt. Du kan ikke lenger redigere brevet. Dersom du har angret på vedtaket finnes det
          en ny oppgave i din liste hvor du kan redigere brevet som tidligere var tilknyttet denne oppgaven.
        </BrevInfoCard>
        <BrevForhåndsvisning brevId={brev?.brevId} />
      </BrevPanelLayout>
    )
  }

  if (!gjeldendeBehandling?.utfall) {
    return (
      <BrevPanelLayout>
        <BrevInfoCard title="Ingen mal valgt for brevutkast">
          I fremtiden vil man kunne opprette brev underveis i saken her. Foreløpig må du sette et vedtaksresultat i
          behandlingspanelet og velge om du vil opprette vedtaksbrev der.
        </BrevInfoCard>
      </BrevPanelLayout>
    )
  }

  if (!brev) {
    return (
      <BrevPanelLayout>
        <BrevInfoCard title="Brevutkast ikke opprettet">Det er ikke opprettet noe vedtaksbrev i saken.</BrevInfoCard>
      </BrevPanelLayout>
    )
  }

  if (!oppgave) return null

  return (
    <Box className={classes.container} background="default">
      <Suspense>
        <BrevRedigering oppgave={oppgave} behandling={gjeldendeBehandling} brevId={brev.brevId} />
      </Suspense>
    </Box>
  )
}

function BrevPanelLayout({ tittel = 'Brev', children }: { tittel?: string; children: ReactNode }) {
  const closePanel = useClosePanel('brevpanel')
  return (
    <Box className={classes.container} background="default">
      <VStack paddingInline="space-20" gap="space-16" height="100%">
        <PanelTittel paddingInline="space-8 space-0" tittel={tittel} lukkPanel={closePanel} />
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

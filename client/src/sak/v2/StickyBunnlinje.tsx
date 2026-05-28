import { Box, Button, HStack, Tag } from '@navikt/ds-react'

import { useMemo } from 'react'
import { Tekst } from '../../felleskomponenter/typografi'
import { OppgavePåVentTag } from '../../oppgave/OppgavePåVentTag.tsx'
import { type Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../../oppgave/useOppgaveregler'
import { useUtførtAv, utførtAvNavn } from '../../tilgang/UtførtAv.ts'
import { OppgaveStatusLabel, Sak } from '../../types/types.internal'
import { formaterDato } from '../../utils/dato'
import {
  type FerdigstiltBehandling,
  Gjenstående,
  isBehandlingFerdigstilt,
  isBehandlingsutfallOverføring,
} from './behandling/behandlingTyper'
import { useBehandling } from './behandling/useBehandling'
import { BehandlingsutfallTag } from './BehandlingsutfallTag.tsx'
import classes from './StickyBunnlinje.module.css'

export interface StickyBunnlinjeProps {
  oppgave?: Saksbehandlingsoppgave
  sak: Sak
  onClick(): void
}

export function StickyBunnlinje({ oppgave, sak, onClick }: StickyBunnlinjeProps) {
  const { oppgaveErAvsluttet, oppgaveErUnderBehandlingAvInnloggetAnsatt, oppgaveErPåVent } = useOppgaveregler(oppgave)
  const { gjeldendeBehandling } = useBehandling()

  const knappevariant = useMemo(
    () =>
      [Gjenstående.BREV_IKKE_FERDIGSTILT, Gjenstående.BREV_MANGLER, Gjenstående.UTFALL_MANGLER].some((gjenstående) =>
        gjeldendeBehandling?.gjenstående.includes(gjenstående)
      )
        ? 'secondary'
        : 'primary',
    [gjeldendeBehandling]
  )

  return (
    <HStack
      asChild
      position="sticky"
      left="space-0"
      bottom="space-0"
      align="center"
      justify="space-between"
      gap="space-16"
      paddingInline="space-16"
      paddingBlock="space-8"
      width="100%"
    >
      <Box
        position="sticky"
        background="default"
        borderWidth="1 0 0 0"
        borderColor="neutral-subtle"
        className={classes.root}
      >
        <HStack align="center" justify="space-between" gap="space-16">
          {oppgaveErUnderBehandlingAvInnloggetAnsatt && (
            <Button type="button" variant={knappevariant} size="small" onClick={() => onClick()}>
              {isBehandlingsutfallOverføring(gjeldendeBehandling?.utfall)
                ? 'Overfør til Gosys'
                : gjeldendeBehandling?.utfall?.type === 'HENLEGGELSE'
                  ? 'Ferdigstill'
                  : 'Fatt vedtak'}
            </Button>
          )}
          {isBehandlingFerdigstilt(gjeldendeBehandling) && <Behandlingsutfall behandling={gjeldendeBehandling} />}
          {!oppgaveErPåVent && !oppgaveErAvsluttet && (
            <Tag data-color="neutral" variant="moderate" size="small">
              {OppgaveStatusLabel.get(sak.saksstatus)}
            </Tag>
          )}
          {oppgave && oppgaveErPåVent && <OppgavePåVentTag oppgave={oppgave} />}
        </HStack>
      </Box>
    </HStack>
  )
}

function Behandlingsutfall({ behandling }: { behandling: FerdigstiltBehandling }) {
  const ferdigstiltTidspunkt = behandling.ferdigstiltTidspunkt || behandling.midlertidigFerdigstiltTidspunkt
  const utførtAv = useUtførtAv(behandling.utførtAv)
  const saksbehandler = utførtAvNavn(utførtAv)
  return (
    <HStack gap="space-12" align="center">
      <BehandlingsutfallTag utfall={behandling.utfall.utfall} />
      <Tekst>{`av: ${saksbehandler} ${formaterDato(ferdigstiltTidspunkt)}`}</Tekst>
    </HStack>
  )
}

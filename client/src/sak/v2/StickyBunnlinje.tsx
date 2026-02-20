import { Box, Button, HStack, Tag } from '@navikt/ds-react'
import { Tekst } from '../../felleskomponenter/typografi'
import { Oppgavestatus } from '../../oppgave/oppgaveTypes'
import { useOppgave } from '../../oppgave/useOppgave'
import { useOppgaveregler } from '../../oppgave/useOppgaveregler'
import { OppgaveStatusLabel, Sak } from '../../types/types.internal'
import { formaterDato } from '../../utils/dato'
import { storForbokstavIOrd } from '../../utils/formater'
import { Gjenstående, UtfallLåst, VedtaksResultat } from './behandling/behandlingTyper'
import { useBehandling } from './behandling/useBehandling'
import classes from './StickyBunnlinje.module.css'

export function StickyBunnlinje({ sak, onClick }: { sak: Sak; onClick: () => void }) {
  const { oppgave } = useOppgave()
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const oppgaveFerdigstilt = oppgave?.oppgavestatus === Oppgavestatus.FERDIGSTILT
  const { gjeldendeBehandling } = useBehandling()

  const knappevariant = [Gjenstående.BREV_IKKE_FERDIGSTILT, Gjenstående.BREV_MANGLER, Gjenstående.UTFALL_MANGLER].some(
    (gjenstående) => gjeldendeBehandling?.gjenstående.includes(gjenstående)
  )
    ? 'secondary'
    : 'primary'

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
        <HStack align="center" justify="space-between" gap="space-24">
          {oppgaveErUnderBehandlingAvInnloggetAnsatt && (
            <Button type="button" variant={knappevariant} size="small" onClick={() => onClick()}>
              Fatt vedtak
            </Button>
          )}
          {oppgaveFerdigstilt && gjeldendeBehandling?.utfallLåst?.includes(UtfallLåst.FERDIGSTILT) && (
            <HStack gap="space-12" align="center">
              <Tag
                size="small"
                variant={
                  oppgaveFerdigstilt && gjeldendeBehandling.utfall?.utfall == VedtaksResultat.INNVILGET
                    ? 'success-moderate'
                    : oppgaveFerdigstilt && gjeldendeBehandling.utfall?.utfall == VedtaksResultat.DELVIS_INNVILGET
                      ? 'warning-moderate'
                      : oppgaveFerdigstilt && gjeldendeBehandling.utfall?.utfall == VedtaksResultat.AVSLÅTT
                        ? 'error-moderate'
                        : 'neutral-moderate'
                }
              >
                {storForbokstavIOrd(gjeldendeBehandling.utfall?.utfall).replace(/_/g, ' ')}
              </Tag>
              <Tekst>{`av: ${sak.saksbehandler?.navn} ${formaterDato(sak.vedtak?.vedtaksdato)}`}</Tekst>
            </HStack>
          )}
          {!oppgaveFerdigstilt && (
            <Tag data-color="neutral" variant="moderate" size="small">
              {OppgaveStatusLabel.get(sak.saksstatus)}
            </Tag>
          )}
        </HStack>
      </Box>
    </HStack>
  )
}

import { Box, HStack, InlineMessage, Link, VStack } from '@navikt/ds-react'

import { useMemo } from 'react'
import { Tekst } from '../../../felleskomponenter/typografi'
import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes'
import { useOppgavesøk } from '../../../oppgave/useOppgavesøk.ts'
import { useSaksregler } from '../../../saksregler/useSaksregler'
import { type Sak } from '../../../types/types.internal'
import { formaterDatoKort } from '../../../utils/dato'
import { useMiljø } from '../../../utils/useMiljø.ts'
import { OppgaverOgDokumenterFilter, opprettetIntervallForFilter } from '../sidebars/OppgaverOgDokumenterUtils.ts'
import { JournalpostCard } from './JournalpostCard'

export function BehandlingPanelHeader({ oppgave, sak }: { oppgave?: Saksbehandlingsoppgave; sak: Sak }) {
  const { erBestilling } = useSaksregler()
  const { erIkkeProd } = useMiljø()

  const opprettetIntervallSisteToUker = useMemo(
    () => opprettetIntervallForFilter(OppgaverOgDokumenterFilter.SISTE_2_UKER),
    []
  )

  const oppgaverResponse = useOppgavesøk({
    brukerId: oppgave?.fnr,
    sorteringsfelt: 'OPPRETTET_TIDSPUNKT',
    opprettetIntervall: opprettetIntervallSisteToUker,
    pageSize: 2,
  })
  const harOppgaverSisteToUker =
    !!oppgave && (oppgaverResponse.data?.oppgaver.some(({ oppgaveId }) => oppgaveId !== oppgave.oppgaveId) ?? false)

  return (
    <VStack gap="space-16" paddingInline="space-0 space-8" marginBlock="space-0 space-16">
      <HStack gap="space-20" paddingInline="space-8 space-0">
        <Tekst data-tip="Saksnummer" data-for="sak" textColor="subtle">{`Sak: ${sak.sakId}`}</Tekst>
        {oppgave?.fristFerdigstillelse && (
          <Tekst textColor="subtle">Frist: {formaterDatoKort(oppgave.fristFerdigstillelse)}</Tekst>
        )}
      </HStack>
      {!erBestilling && (
        <>
          <Box paddingInline="space-8 space-0">
            <Tekst>
              <Link href="https://lovdata.no/lov/1997-02-28-19/§10-6" target="_blank">
                Slå opp folketrygdlovens § 10-6 i Lovdata
              </Link>
            </Tekst>
          </Box>
          {harOppgaverSisteToUker && (
            <Box paddingInline="space-8 space-0">
              <InlineMessage status="info" size="small">
                Bruker har en oppgave som enten er åpen, eller behandlet de siste 2 ukene hos {sak.enhet.navn}
              </InlineMessage>
            </Box>
          )}
          {erIkkeProd && <JournalpostCard />}
        </>
      )}
    </VStack>
  )
}

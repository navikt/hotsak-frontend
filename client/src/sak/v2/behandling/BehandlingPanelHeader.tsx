import { Box, HStack, Link, VStack } from '@navikt/ds-react'

import { Tekst } from '../../../felleskomponenter/typografi'
import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes'
import { type Sak } from '../../../types/types.internal'
import { formaterDatoKort } from '../../../utils/dato'

export function BehandlingPanelHeader({ oppgave, sak }: { oppgave?: Saksbehandlingsoppgave; sak: Sak }) {
  return (
    <VStack gap="space-16" paddingInline="space-0 space-8" marginBlock="space-0 space-16">
      <HStack gap="space-20" paddingInline="space-8 space-0">
        <Tekst data-tip="Saksnummer" data-for="sak" textColor="subtle">{`Sak: ${sak.sakId}`}</Tekst>
        {oppgave?.fristFerdigstillelse && (
          <Tekst textColor="subtle">Frist: {formaterDatoKort(oppgave.fristFerdigstillelse)}</Tekst>
        )}
      </HStack>
      <Box paddingInline="space-8 space-0">
        <Tekst>
          <Link href="https://lovdata.no/lov/1997-02-28-19/§10-6" target="_blank">
            Slå opp folketrygdlovens § 10-6 i Lovdata
          </Link>
        </Tekst>
      </Box>
    </VStack>
  )
}

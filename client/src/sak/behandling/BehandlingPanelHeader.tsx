import { Box, HStack, InlineMessage, Link, LocalAlert, VStack } from '@navikt/ds-react'
import { useFlag } from '@unleash/proxy-client-react'

import { useMemo } from 'react'
import { Tekst } from '../../felleskomponenter/typografi.tsx'
import { type Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes.ts'
import { useOppgavesøk } from '../../oppgave/useOppgavesøk.ts'
import { useSaksregler } from '../../saksregler/useSaksregler.ts'
import { FeatureToggle } from '../../unleash/FeatureToggle.ts'
import { type Sak } from '../../types/types.internal.ts'
import { formaterDatoKort } from '../../utils/dato.ts'
import { OppgaverOgDokumenterFilter, opprettetIntervallForFilter } from '../sidebars/OppgaverOgDokumenterUtils.ts'
import { JournalpostCard } from './JournalpostCard.tsx'
import { InlineKopiknapp } from '../../felleskomponenter/Kopiknapp.tsx'
import { usePerson } from '../../personoversikt/usePerson.ts'

export function BehandlingPanelHeader({ oppgave, sak }: { oppgave?: Saksbehandlingsoppgave; sak: Sak }) {
  const { erBestilling } = useSaksregler()
  const { manglerIOebs } = usePerson(sak.bruker.fnr)
  const erJournalføringPilot = useFlag(FeatureToggle.journalforing)

  const opprettetIntervallSisteToUker = useMemo(
    () => opprettetIntervallForFilter(OppgaverOgDokumenterFilter.SISTE_2_UKER),
    []
  )

  const oppgaverResponse = useOppgavesøk(
    oppgave?.fnr
      ? {
          brukerId: oppgave?.fnr,
          sorteringsfelt: 'OPPRETTET_TIDSPUNKT',
          opprettetIntervall: opprettetIntervallSisteToUker,
          alleFagsystemer: true,
          pageSize: 2,
        }
      : undefined
  )
  const harOppgaverSisteToUker =
    !!oppgave && (oppgaverResponse.data?.oppgaver.some(({ oppgaveId }) => oppgaveId !== oppgave.oppgaveId) ?? false)

  return (
    <VStack gap="space-16" paddingInline="space-0 space-8" marginBlock="space-0 space-16">
      <HStack gap="space-20" paddingInline="space-8 space-0">
        <HStack gap="space-4">
          <Tekst data-tip="Saksnummer" data-for="sak" textColor="subtle">{`Sak: ${sak.sakId}`}</Tekst>
          <InlineKopiknapp copyText={sak.sakId} tooltip="Kopier saksnummer" />
        </HStack>
        {oppgave?.fristDato && <Tekst textColor="subtle">Frist: {formaterDatoKort(oppgave.fristDato)}</Tekst>}
      </HStack>
      {manglerIOebs && (
        <LocalAlert status="warning" size="small">
          <LocalAlert.Header>
            <LocalAlert.Title>Bruker ikke funnet i OeBS</LocalAlert.Title>
          </LocalAlert.Header>
          <LocalAlert.Content>
            Brukeren finnes ikke i OeBS. Du må melde en{' '}
            <Link href="https://jira.adeo.no/plugins/servlet/desk/portal/541/create/1521" target="_blank">
              sak i porten
            </Link>{' '}
            slik at bruker opprettes i OeBs før du kan fatte vedtak. Hvis saken skal henlegges eller avslås, er det ikke
            nødvendig å gjøre dette.
          </LocalAlert.Content>
        </LocalAlert>
      )}
      {harOppgaverSisteToUker && (
        <Box paddingInline="space-8 space-0">
          <InlineMessage status="info" size="small">
            Bruker har en oppgave som enten er åpen, eller behandlet de siste 2 ukene hos {sak.enhet.navn}
          </InlineMessage>
        </Box>
      )}
      {!erBestilling && (
        <>
          <Box paddingInline="space-8 space-0">
            <Tekst>
              <Link href="https://lovdata.no/lov/1997-02-28-19/§10-6" target="_blank">
                Slå opp folketrygdlovens § 10-6 i Lovdata
              </Link>
            </Tekst>
          </Box>
          {erJournalføringPilot && <JournalpostCard />}
        </>
      )}
    </VStack>
  )
}

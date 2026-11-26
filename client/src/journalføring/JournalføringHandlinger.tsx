import { Button, HStack, Tag } from '@navikt/ds-react'

import { StickyHStack } from '../felleskomponenter/StickyHStack.tsx'
import { OppgaveModalType, useOppgaveÅpneModalHandler } from '../oppgave/OppgaveContext.ts'
import { SvartidsbrevValg } from './journalføringTypes.ts'

interface JournalføringHandlingerProps {
  kanRedigere: boolean
  erJournalført: boolean
  sakType: 'ny' | 'eksisterende'
  isJournalfører: boolean
  onJournalfør(): void
  svartidsbrevValg: SvartidsbrevValg | null
}

export function JournalføringHandlinger({
  kanRedigere,
  erJournalført,
  sakType,
  isJournalfører,
  onJournalfør,
  svartidsbrevValg,
}: JournalføringHandlingerProps) {
  const åpneModal = useOppgaveÅpneModalHandler()

  return (
    <>
      {kanRedigere && (
        <StickyHStack align="center" justify="start">
          <HStack gap="space-4" paddingInline="space-16" paddingBlock="space-8">
            <Button
              type="button"
              variant="primary"
              size="small"
              loading={isJournalfører}
              disabled={isJournalfører}
              onClick={onJournalfør}
            >
              {sakType === 'eksisterende'
                ? 'Journalfør og koble til sak'
                : svartidsbrevValg
                  ? 'Journalfør, opprett sak og send brev'
                  : 'Journalfør og opprett sak'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={() => åpneModal(OppgaveModalType.OVERFØR_TIL_GOSYS)}
            >
              Overfør til Gosys
            </Button>
          </HStack>
        </StickyHStack>
      )}
      {erJournalført && (
        <StickyHStack align="center" justify="start" paddingBlock="space-8" paddingInline="space-8">
          <Tag data-color="info" variant="moderate" size="medium">
            Journalført
          </Tag>
        </StickyHStack>
      )}
    </>
  )
}

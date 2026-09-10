import { Box, VStack } from '@navikt/ds-react'

import { PanelTittel } from '../../felleskomponenter/panel/PanelTittel.tsx'
import { ScrollablePanel } from '../../felleskomponenter/ScrollablePanel.tsx'
import { usePunchedeHjelpemidler } from '../../saksbilde/hjelpemidler/usePunchedeHjelpemidler.ts'
import { type Sak } from '../../types/types.internal.ts'
import { PunchetHjelpemiddelV2 } from './behovsmelding/PunchetHjelpemiddelV2.tsx'
import { useClosePanel } from './paneler/usePanelHooks.ts'

export function PunchedeHjelpemidlerPanel({ sak }: { sak: Sak }) {
  const lukkPanel = useClosePanel('hjelpemidlerpanel')
  const { punchedeHjelpemidler } = usePunchedeHjelpemidler(sak.sakId)

  return (
    <Box background="default" paddingBlock="space-0 space-36" paddingInline="space-12 space-0" height="100%">
      <PanelTittel tittel="Hjelpemidler" lukkPanel={lukkPanel} />
      <ScrollablePanel paddingInline="space-0 space-4" paddingBlock="space-4 space-24" aria-label="Hjelpemidlerpanel">
        <VStack gap="space-8" paddingInline="space-4">
          {punchedeHjelpemidler.map((hjelpemiddel, index) => (
            <PunchetHjelpemiddelV2 key={`${hjelpemiddel.hmsnummer}-${index}`} hjelpemiddel={hjelpemiddel} />
          ))}
        </VStack>
      </ScrollablePanel>
    </Box>
  )
}

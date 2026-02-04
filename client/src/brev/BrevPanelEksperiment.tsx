import { Box, InfoCard } from '@navikt/ds-react'
import { Brev } from './Brev.tsx'
import { useRefSize } from './breveditor/hooks.ts'
import { DokumentProvider } from '../dokument/DokumentContext.tsx'

export function BrevPanelEksperiment() {
  // Vis alert hvis panelet blir for tynt for å vise editoren med en brukbar verktøylinje
  const { size, ref: elmRef } = useRefSize()
  const erPanelForSmalt = size && size.width < 320

  return (
    <Box.New ref={elmRef} style={{ height: '100%' }} background="default" borderRadius="large large 0 0">
      {erPanelForSmalt && (
        <div style={{ paddingBlock: 'var(--ax-space-12)', paddingInline: 'var(--ax-space-8)' }}>
          <InfoCard size="small" data-color="info">
            <InfoCard.Header>
              <InfoCard.Title>Panelet er for smalt</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
              Det ser ut som panelet er litt smalt til å vise brevet — kan du gjøre det litt bredere?
            </InfoCard.Content>
          </InfoCard>
        </div>
      )}
      {!erPanelForSmalt && (
        <DokumentProvider>
          <Brev />
        </DokumentProvider>
      )}
    </Box.New>
  )
}

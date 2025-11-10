import { Alert, Box } from '@navikt/ds-react'
import { Brev } from './Brev.tsx'
import { useRefSize } from './breveditor/hooks.ts'

export function BrevPanelEksperiment() {
  // Vis alert hvis panelet blir for tynt for å vise editoren med en brukbar verktøylinje
  const { size, ref: elmRef } = useRefSize()
  const erPanelForSmalt = size && size.width < 320

  return (
    <Box.New ref={elmRef} style={{ height: '100%' }} background="default" borderRadius="large large 0 0">
      {erPanelForSmalt && (
        <div style={{ padding: '0.4em' }}>
          <Alert size="small" variant="info">
            Det ser ut som panelet er litt smalt til å vise brevet — kan du gjøre det litt bredere?
          </Alert>
        </div>
      )}
      {!erPanelForSmalt && <Brev />}
    </Box.New>
  )
}

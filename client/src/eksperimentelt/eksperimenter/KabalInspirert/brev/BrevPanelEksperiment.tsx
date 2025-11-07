import { Alert, Box } from '@navikt/ds-react'
import { Brev } from './Brev.tsx'
import { useRefSize } from './util.ts'

export function BrevPanelEksperiment() {
  // Vis alert hvis panelet blir for tynt for å vise editoren med en brukbar verktøylinje
  const { size, ref: elmRef } = useRefSize()
  const erPanelForSmalt = size && size.width < 320

  return (
    <Box.New
      ref={elmRef}
      style={{ height: '100%', padding: 'var(--ax-radius-8) 0 0 0' }}
      padding={'space-16'}
      background="default"
      borderRadius="large large 0 0"
    >
      {erPanelForSmalt && (
        <Alert size="small" variant="info" style={{ margin: '0.4em' }}>
          Det ser ut som panelet er litt smalt til å vise brevet — kan du gjøre det litt bredere?
        </Alert>
      )}
      {!erPanelForSmalt && <Brev />}
    </Box.New>
  )
}

import { Box, HGrid, Skeleton } from '@navikt/ds-react'

import { hotsakHistorikkMinWidth, hotsakVenstremenyWidth } from '../GlobalStyles'
import { LasterPersonlinje } from './Personlinje'

export function SakLoader() {
  const spacing = '4'
  return (
    <>
      <LasterPersonlinje />
      <HGrid columns={`auto ${hotsakHistorikkMinWidth}`} style={{ maxWidth: '1592px' }}>
        <section>
          <Box margin={spacing}>
            <Skeleton variant="rectangle" width="100%" height={30} />
          </Box>
          <HGrid columns={`${hotsakVenstremenyWidth} auto`} gap={spacing} marginInline="space-0 space-16">
            <Skeleton variant="rectangle" width="100%" height={800} />
            <Skeleton variant="rectangle" width="100%" height={800} />
          </HGrid>
        </section>
        <Box
          padding={spacing}
          style={{
            borderLeft: '1px solid var(--ax-border-neutral-subtle)',
            borderRight: '1px solid var(--ax-border-neutral-subtle)',
          }}
        >
          <Skeleton variant="rectangle" width="100%" height={845} />
        </Box>
      </HGrid>
    </>
  )
}

import { Box, HGrid, Skeleton } from '@navikt/ds-react'

import { spacingVar } from '../felleskomponenter/Avstand.tsx'
import { hotsakHistorikkMinWidth, hotsakVenstremenyWidth, søknadsbildeHovedinnholdMaxWidth } from '../GlobalStyles'
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
          <HGrid columns={`${hotsakVenstremenyWidth} auto`} gap={spacing}>
            <div style={{ marginLeft: spacingVar(spacing) }}>
              <Skeleton variant="rectangle" width="100%" height={800} />
            </div>
            <div style={{ marginRight: spacingVar(spacing), maxWidth: `${søknadsbildeHovedinnholdMaxWidth}` }}>
              <Skeleton variant="rectangle" width="100%" height={800} />
            </div>
          </HGrid>
        </section>
        <Box
          padding={spacing}
          style={{ borderLeft: '1px solid var(--a-border-subtle)', borderRight: '1px solid var(--a-border-subtle)' }}
        >
          <Skeleton variant="rectangle" width="100%" height={845} />
        </Box>
      </HGrid>
    </>
  )
}

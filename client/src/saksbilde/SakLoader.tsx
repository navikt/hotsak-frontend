import { Box, HGrid, Skeleton } from '@navikt/ds-react'

import { hotsakHistorikkMinWidth, hotsakVenstremenyWidth } from '../GlobalStyles'
import { LasterPersonlinje } from './Personlinje'
import classes from './SakLoader.module.css'

export function SakLoader() {
  const spacing = 'space-16'
  return (
    <>
      <LasterPersonlinje />
      <HGrid columns={`auto ${hotsakHistorikkMinWidth}`} className={classes.skeletonGrid}>
        <section>
          <Box margin={spacing}>
            <Skeleton variant="rectangle" width="100%" height={30} />
          </Box>
          <HGrid columns={`${hotsakVenstremenyWidth} auto`} gap={spacing} marginInline="space-0 space-16">
            <Skeleton variant="rectangle" width="100%" height={800} />
            <Skeleton variant="rectangle" width="100%" height={800} />
          </HGrid>
        </section>
        <Box padding={spacing} className={classes.sidePanel}>
          <Skeleton variant="rectangle" width="100%" height={845} />
        </Box>
      </HGrid>
    </>
  )
}

import { Box, Skeleton } from '@navikt/ds-react'

import { spacingVar } from '../felleskomponenter/Avstand.tsx'
import { hotsakHistorikkWidth, hotsakVenstremenyWidth } from '../GlobalStyles'
import { Hovedinnhold, Saksinnhold } from './komponenter/Sakskomponenter'
import { LasterPersonlinje } from './Personlinje'
import { SaksbildeContainer } from './Saksbilde'

export function SakLoader() {
  const spacing = '4'
  return (
    <SaksbildeContainer>
      <LasterPersonlinje />
      <Hovedinnhold columns={`auto ${hotsakHistorikkWidth}`}>
        <section>
          <Box margin={spacing}>
            <Skeleton variant="rectangle" width="100%" height={30} />
          </Box>
          <Saksinnhold columns={`${hotsakVenstremenyWidth} auto`} gap={spacing}>
            <div style={{ marginLeft: spacingVar(spacing) }}>
              <Skeleton variant="rectangle" width="100%" height={800} />
            </div>
            <div style={{ marginRight: spacingVar(spacing) }}>
              <Skeleton variant="rectangle" width="100%" height={800} />
            </div>
          </Saksinnhold>
        </section>
        <Box padding={spacing} style={{ borderLeft: '1px solid var(--a-border-subtle)' }}>
          <Skeleton variant="rectangle" width="100%" height={845} />
        </Box>
      </Hovedinnhold>
    </SaksbildeContainer>
  )
}

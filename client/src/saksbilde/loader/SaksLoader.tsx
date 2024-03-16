import { HGrid, Skeleton } from '@navikt/ds-react'
import { hotsakHistorikkWidth, hotsaktVenstremenyWidth } from '../../GlobalStyles'
import { LasterPersonlinje } from '../Personlinje'
import { SaksbildeContainer } from '../Saksbilde'
import { Content, Hovedinnhold, Saksinnhold } from '../komponenter/Sakskomponenter'
import { Avstand } from '../../felleskomponenter/Avstand'

export const SaksLoader = () => (
  <SaksbildeContainer>
    <LasterPersonlinje />
    <Hovedinnhold columns={`auto ${hotsakHistorikkWidth}`}>
      <section>
        <HGrid columns={'auto'}>
          <Avstand paddingTop={4} paddingLeft={2} paddingRight={4}>
            <Skeleton variant="rectangle" width="100%" height={30} />
          </Avstand>
        </HGrid>
        <Saksinnhold columns={`${hotsaktVenstremenyWidth} auto`}>
          <Avstand paddingTop={4} paddingLeft={4} paddingRight={4}>
            <Skeleton variant="rectangle" width="100%" height={800} />
          </Avstand>
          <Content>
            <Avstand paddingLeft={4} paddingRight={4}>
              <Skeleton variant="rectangle" width="100%" height={800} />
            </Avstand>
          </Content>
        </Saksinnhold>
      </section>

      <div style={{ borderLeft: '1px solid var(--a-border-subtle)' }}>
        <Avstand paddingTop={4} paddingLeft={4} paddingRight={4}>
          <Skeleton variant="rectangle" width="100%" height={840} />
        </Avstand>
      </div>
    </Hovedinnhold>
  </SaksbildeContainer>
)

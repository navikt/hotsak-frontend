import { Panel, PanelGroup } from 'react-resizable-panels'

import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import { Breveditor } from './Breveditor'
import { BrevmalVelger } from './BrevmalVelger'
import { Box } from '@navikt/ds-react'

export function BrevPanelEksperiment() {
  return (
    <Box.New style={{ height: '100dvh' }}>
      <PanelGroup direction="horizontal" autoSaveId="eksperimenteltBrevPanel">
        <>
          <Panel defaultSize={30} minSize={10} order={1}>
            <BrevmalVelger />
          </Panel>
          <ResizeHandle />
        </>
        <Panel defaultSize={70} minSize={30} order={2}>
          <Breveditor />
        </Panel>
      </PanelGroup>
    </Box.New>
  )
}

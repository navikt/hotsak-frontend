import { Panel, PanelGroup } from 'react-resizable-panels'

import { Box, Switch } from '@navikt/ds-react'
import { useState } from 'react'
import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import { Breveditor } from './Breveditor'
import { BrevmalVelger } from './BrevmalVelger'

export function BrevPanelEksperiment() {
  const [visBrevvelger, setVisBrevvelger] = useState(true)

  return (
    <Box.New style={{ height: '100dvh' }} padding={'space-16'} background="default" borderRadius="large large 0 0">
      <Switch checked={visBrevvelger} size="small" onChange={() => setVisBrevvelger(!visBrevvelger)}>
        Brevvelger
      </Switch>
      <PanelGroup direction="horizontal" autoSaveId="eksperimenteltBrevPanel">
        {visBrevvelger && (
          <>
            <Panel defaultSize={40} minSize={10} order={1}>
              <BrevmalVelger />
            </Panel>
            <ResizeHandle />
          </>
        )}
        <Panel defaultSize={60} minSize={30} order={2}>
          <Breveditor />
        </Panel>
      </PanelGroup>
    </Box.New>
  )
}

import { Panel, PanelGroup } from 'react-resizable-panels'

import { Box, Switch } from '@navikt/ds-react'
import { useState } from 'react'
import { ResizeHandle } from '../felleskomponenter/ResizeHandle'
import { Breveditor } from './Breveditor'
import { BrevmalVelger } from './BrevmalVelger'

export function BrevPanelEksperiment() {
  const [skjulBrevvelger, setSkjulBrevvelger] = useState(false)

  return (
    <Box.New style={{ height: '100dvh' }} padding={'space-16'}>
      <Switch checked={skjulBrevvelger} size="small" onChange={() => setSkjulBrevvelger(!skjulBrevvelger)}>
        Brevvelger
      </Switch>
      <PanelGroup direction="horizontal" autoSaveId="eksperimenteltBrevPanel">
        {!skjulBrevvelger && (
          <>
            <Panel defaultSize={30} minSize={10} order={1}>
              <BrevmalVelger />
            </Panel>
            <ResizeHandle />
          </>
        )}
        <Panel defaultSize={70} minSize={30} order={2}>
          <Breveditor />
        </Panel>
      </PanelGroup>
    </Box.New>
  )
}

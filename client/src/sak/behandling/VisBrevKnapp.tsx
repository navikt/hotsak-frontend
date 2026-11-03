import { Button } from '@navikt/ds-react'

import { usePanel, useSetPanelVisibility } from '../paneler/usePanelHooks.ts'

interface VisBrevKnappProps {
  erHenleggelse: boolean
}

export function VisBrevKnapp({ erHenleggelse }: VisBrevKnappProps) {
  const brevPanel = usePanel('brevpanel')
  const setBrevpanelVisibility = useSetPanelVisibility('brevpanel')

  if (brevPanel.visible) {
    return null
  }

  return (
    <div>
      <Button
        variant="secondary"
        size="small"
        onClick={() => {
          setBrevpanelVisibility(true)
        }}
      >
        Vis {erHenleggelse ? 'brev' : 'vedtaksbrev'}
      </Button>
    </div>
  )
}

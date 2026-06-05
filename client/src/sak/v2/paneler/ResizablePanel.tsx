import { type ComponentProps, type ReactNode } from 'react'
import { Panel } from 'react-resizable-panels'

import { ResizeHandle } from '../../../felleskomponenter/resize/ResizeHandle.tsx'
import { useSakContext } from '../SakV2ContextType.ts'
import { hasVisiblePanelToLeft, type PanelConfig, type PanelId } from './panelReducer.ts'

type ResizablePanelProps = {
  panelId: PanelId
  panel: PanelConfig
  visible?: boolean
  canShowResizeHandle?: boolean
  children: ReactNode
} & Omit<ComponentProps<typeof Panel>, 'id' | 'minSize' | 'children'>

export function ResizablePanel({
  panelId,
  panel,
  visible = true,
  canShowResizeHandle = visible,
  children,
  defaultSize,
  ...panelProps
}: ResizablePanelProps) {
  const { panelState } = useSakContext()

  if (!visible) {
    return null
  }

  const visResizeHandle = canShowResizeHandle && hasVisiblePanelToLeft(panelState, panelId)

  return (
    <>
      {visResizeHandle && <ResizeHandle />}
      <Panel
        id={panelId}
        defaultSize={defaultSize ?? panel.defaultSize}
        minSize={`${panel.minWidth}${panel.minWidthUnit}`}
        {...panelProps}
      >
        {children}
      </Panel>
    </>
  )
}

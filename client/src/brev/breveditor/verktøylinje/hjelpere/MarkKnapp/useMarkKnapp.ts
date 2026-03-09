import { useEditorState } from 'platejs/react'
import { useBreveditorContext } from '../../../BreveditorContext'

export const useMarkKnapp = (markKey: string) => {
  const editor = useEditorState()
  const breveditor = useBreveditorContext()

  const isActive = (() => {
    if (!breveditor.erPlateContentFokusert) return false
    if (!editor.selection) return false
    try {
      return !!editor.api.mark(markKey)
    } catch {
      return false
    }
  })()

  return {
    toggle: () => editor.tf.toggleMark(markKey),
    active: isActive,
    disabled: !breveditor.erPlateContentFokusert,
  }
}

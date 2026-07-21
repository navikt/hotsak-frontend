import { useEditorState } from 'platejs/react'

export const useAngreKnapp = () => {
  const editor = useEditorState()
  return {
    undo: () => editor.undo(),
    disabled: editor.history.undos.length == 0,
  }
}

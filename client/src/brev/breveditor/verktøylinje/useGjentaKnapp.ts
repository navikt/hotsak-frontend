import { useEditorState } from 'platejs/react'

export function useGjentaKnapp() {
  const editor = useEditorState()
  return {
    redo: () => editor.redo(),
    disabled: editor.history.redos.length == 0,
  }
}

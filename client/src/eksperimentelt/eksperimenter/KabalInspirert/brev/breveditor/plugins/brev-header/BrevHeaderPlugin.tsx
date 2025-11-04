import { PlateElement, type PlateElementProps, createPlatePlugin } from 'platejs/react'
import type { Editor } from 'platejs'

export function BrevHeader({ children, ...props }: PlateElementProps) {
  return (
    <PlateElement {...props}>
      <div contentEditable={false} style={{ background: 'red', padding: '10px' }}>
        testitest {children}
      </div>
    </PlateElement>
  )
}

export const BrevHeaderPlugin = createPlatePlugin({
  key: 'brevHeader',
  node: {
    isElement: true,
    isVoid: true,
    type: 'brevHeader',
    component: BrevHeader,
  },
}).overrideEditor(({ editor, tf: { deleteBackward, deleteForward, deleteFragment } }) => ({
  transforms: {
    deleteBackward(options) {
      if (isVoidHeaderSelected(editor)) {
        return
      }
      deleteBackward(options)
    },
    deleteForward(options) {
      if (isVoidHeaderSelected(editor)) {
        return
      }
      deleteForward(options)
    },
    deleteFragment(options) {
      if (isVoidHeaderSelected(editor)) {
        return
      }
      deleteFragment(options)
    },
  },
}))

function isVoidHeaderSelected(editor: Editor) {
  const { selection } = editor
  if (!selection) return false
  const [nodeEntry] = editor.api.nodes({
    at: selection,
    match: (n) => n.type === 'brevHeader',
  })
  return !!nodeEntry
}

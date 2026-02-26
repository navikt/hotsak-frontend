import { createPlatePlugin } from 'platejs/react'
import { Placeholder } from './Placeholder/Placeholder'
import { ELEMENT_PLACEHOLDER } from './PlaceholderElement'

const EMPTY_CHAR = '\uFEFF'
const EMPTY_CHAR_REGEX = new RegExp(EMPTY_CHAR, 'g')

const hentSynligTekst = (text: string) => text.replace(EMPTY_CHAR_REGEX, '')

const gåTilPlaceholder = (editor: any, node: any, path: any[]) => {
  const textPath = [...path, 0]
  if (!editor.api.hasPath(textPath)) return

  const text = node.children?.[0]?.text || ''
  const synlig = hentSynligTekst(text)
  const offset = text.includes(EMPTY_CHAR) ? 1 : 0

  editor.tf.focus()

  if (synlig.length > 0) {
    editor.tf.select({
      anchor: { path: textPath, offset },
      focus: { path: textPath, offset: offset + synlig.length },
    })
  } else {
    const point = { path: textPath, offset }
    editor.tf.select({ anchor: point, focus: point })
  }
  setTimeout(() => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const element = range.startContainer.parentElement
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, 0)
}

export const PlaceholderPlugin = createPlatePlugin({
  key: ELEMENT_PLACEHOLDER,
  node: {
    isElement: true,
    isInline: true,
    isVoid: false,
    component: Placeholder,
  },
  handlers: {
    onKeyDown: ({ editor, event }) => {
      if (event.key !== 'Tab') return

      const allePlaceholders = Array.from(
        editor.api.nodes({
          at: [],
          match: (n: any) => n.type === ELEMENT_PLACEHOLDER,
        })
      ) as [any, any[]][]

      if (allePlaceholders.length === 0) return

      const currentPath = editor.selection?.anchor?.path
      if (!currentPath) return

      const currentIndex = allePlaceholders.findIndex(([, path]) => currentPath.join(',').startsWith(path.join(',')))

      // I en liste men ikke i en placeholder — la liste-plugin håndtere Tab for innrykk
      if (currentIndex === -1) {
        const inList = editor.api.some({
          match: (n: any) => n.type === 'ul' || n.type === 'ol',
        })
        if (inList) return
      }

      event.preventDefault()
      event.stopPropagation()

      if (currentIndex === -1) {
        // Ikke i placeholder og ikke i liste — gå til første placeholder
        const index = event.shiftKey ? allePlaceholders.length - 1 : 0
        const [node, path] = allePlaceholders[index]
        gåTilPlaceholder(editor, node, path)
        return
      }

      const nesteIndex = event.shiftKey
        ? (currentIndex - 1 + allePlaceholders.length) % allePlaceholders.length
        : (currentIndex + 1) % allePlaceholders.length

      const [nesteNode, nestePath] = allePlaceholders[nesteIndex]
      gåTilPlaceholder(editor, nesteNode, nestePath)
    },
  },
})

import { PlateElement, PlateElementProps, useEditorReadOnly } from 'platejs/react'
import { useCallback, useEffect, useMemo } from 'react'
import { TrashIcon } from '@navikt/aksel-icons'
import { Button, Tooltip } from '@navikt/ds-react'
import { PathApi } from '@udecode/plate'
import { ELEMENT_PLACEHOLDER, PlaceholderElement } from './PlaceholderElement'
import './Placeholder.css'

const EMPTY_CHAR = '\uFEFF'
const EMPTY_CHAR_REGEX = new RegExp(EMPTY_CHAR, 'g')

const hentSynligTekst = (text: string) => text.replace(EMPTY_CHAR_REGEX, '')

export const Placeholder = (props: PlateElementProps<PlaceholderElement>) => {
  const { children, element, editor } = props
  const readOnly = useEditorReadOnly()

  const text = useMemo(() => element.children.map((c: { text: string }) => c.text).join(''), [element.children])

  const synligTekst = useMemo(() => hentSynligTekst(text), [text])
  const erTom = synligTekst.length === 0
  const visSøppelbøtte = !readOnly && erTom && element.deletable !== false

  // passe på at placeholder alltid har usynlig karakter for posisjonering av musepeker
  useEffect(() => {
    if (text.length > 0) return

    const path = editor.api.findPath(element)
    if (!path) return

    const textPath = [...path, 0]
    if (!editor.api.hasPath(textPath)) return

    editor.tf.insertText(EMPTY_CHAR, { at: { path: textPath, offset: 0 } })
  }, [editor, element, text])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (!erTom) return

      const path = editor.api.findPath(element)
      if (!path) return

      e.preventDefault()
      const offset = text.includes(EMPTY_CHAR) ? 1 : 0
      editor.tf.select({ path: [...path, 0], offset })
    },
    [editor, element, erTom, text]
  )

  const handleDelete = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      const path = editor.api.findPath(element)
      if (!path) return

      // Move cursor to previous element before deleting
      const previousPath = PathApi.previous(path)
      if (!editor.selection && previousPath) {
        editor.tf.focus()
        const point = editor.api.end(previousPath)
        editor.tf.setSelection({ focus: point, anchor: point })
      }

      editor.tf.delete({ at: path })
      editor.tf.focus()
    },
    [editor, element]
  )

  return (
    <PlateElement
      {...props}
      as="span"
      attributes={{
        ...props.attributes,
        contentEditable: !readOnly,
        suppressContentEditableWarning: true,
      }}
    >
      <Tooltip content={element.placeholder}>
        <span
          className={`placeholder-element ${erTom ? 'placeholder-empty' : 'placeholder-filled'}`}
          data-node-type={ELEMENT_PLACEHOLDER}
          data-placeholder={erTom ? element.placeholder : undefined}
          onClick={handleClick}
        >
          {visSøppelbøtte && (
            <Button
              size="xsmall"
              className="placeholder-delete-btn"
              title="Slett innfyllingsfelt"
              contentEditable={false}
              onClick={handleDelete}
              icon={<TrashIcon aria-hidden />}
            />
          )}
          {children}
        </span>
      </Tooltip>
    </PlateElement>
  )
}

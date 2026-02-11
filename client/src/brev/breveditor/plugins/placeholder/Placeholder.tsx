import { PlateElement, PlateElementProps, useEditorReadOnly } from 'platejs/react'
import { useCallback, useEffect, useMemo } from 'react'
import { TrashIcon } from '@navikt/aksel-icons'
import { Button, Tooltip } from '@navikt/ds-react'
import { PathApi } from '@udecode/plate'
import { ELEMENT_PLACEHOLDER, PlaceholderElement } from './PlaceholderElement'
import './Placeholder.css'

const EMPTY_CHAR = '\uFEFF'

const getHarIkkeSynligTekst = (text: string) => text.replace(new RegExp(EMPTY_CHAR, 'g'), '').length === 0
const getInneholderTomChar = (text: string) => text.includes(EMPTY_CHAR)
const getHarIngenChars = (text: string) => text.length === 0

export const Placeholder = (props: PlateElementProps<PlaceholderElement>) => {
  const { children, element, editor } = props
  const text: string = useMemo(() => element.children.map((c: { text: string }) => c.text).join(''), [element.children])
  const harIkkeSynligTekst = useMemo(() => getHarIkkeSynligTekst(text), [text])
  const harSynligTekst = !harIkkeSynligTekst
  const readOnly = useEditorReadOnly()
  const inneholderTomChar = getInneholderTomChar(text)

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const path = editor.api.findPath(element)

      if (!harIkkeSynligTekst || path === undefined) {
        return
      }

      e.preventDefault()
      editor.tf.select({ path: [...path, 0], offset: inneholderTomChar ? 1 : 0 })
    },
    [inneholderTomChar, editor, element, harIkkeSynligTekst]
  )

  useEffect(() => {
    const path = editor.api.findPath(element)
    if (path === undefined) return

    const at = [...path, 0]
    if (!editor.api.hasPath(at)) return

    if (getHarIngenChars(text)) {
      editor.tf.insertText(EMPTY_CHAR, { at: { path: at, offset: 0 } })
    }
  }, [editor, element, text])

  const deletePlaceholder = useCallback(
    (event: React.MouseEvent) => {
      const path = editor.api.findPath(element)
      if (path === undefined) return

      event.stopPropagation()

      const previousPath = PathApi.previous(path)

      if (editor.selection === null && previousPath !== undefined) {
        if (!editor.api.isFocused()) {
          editor.tf.focus()
        }
        const previousPoint = editor.api.end(previousPath)
        editor.tf.setSelection({ focus: previousPoint, anchor: previousPoint })
      }

      editor.tf.delete({ at: path })

      if (!editor.api.isFocused()) {
        editor.tf.focus()
      }
    },
    [editor, element]
  )

  const hideDeleteButton = readOnly || harSynligTekst || element.deletable === false

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
          className={`placeholder-element ${harIkkeSynligTekst ? 'placeholder-empty' : 'placeholder-filled'}`}
          data-node-type={ELEMENT_PLACEHOLDER}
          data-placeholder={harIkkeSynligTekst ? element.placeholder : undefined}
          onClick={onClick}
        >
          {!hideDeleteButton && (
            <Button
              size="xsmall"
              className="placeholder-delete-btn"
              title="Slett innfyllingsfelt"
              contentEditable={false}
              onClick={deletePlaceholder}
              icon={<TrashIcon aria-hidden />}
            />
          )}
          {children}
        </span>
      </Tooltip>
    </PlateElement>
  )
}

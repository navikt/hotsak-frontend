import * as React from 'react'
import type { TLinkElement } from 'platejs'
import { KEYS } from 'platejs'
import { getLinkAttributes } from '@platejs/link'

import { useEditorRef, useEditorSelection } from 'platejs/react'
import { Button } from '@navikt/ds-react'
import { ExternalLinkIcon } from '@navikt/aksel-icons'

export function OpenLinkButton() {
  const editor = useEditorRef()
  const selection = useEditorSelection()

  const attributes = React.useMemo(
    () => {
      const entry = editor.api.node<TLinkElement>({
        match: { type: editor.getType(KEYS.link) },
      })
      if (!entry) {
        return {}
      }
      const [element] = entry
      return getLinkAttributes(editor, element)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editor, selection]
  )

  // TODO: Vurder å bruk next/link til å wrappe Button i stedenfor onClick, ala. forslag i Aksel. NPM var nede når jeg
  // skrev denne koden, så bruker onClick nå!
  return (
    <Button
      icon={<ExternalLinkIcon />}
      variant="tertiary"
      size="small"
      onMouseOver={(e) => {
        e.stopPropagation()
      }}
      onClick={() => {
        window.open(attributes.href, '_blank')
      }}
    />
  )
}

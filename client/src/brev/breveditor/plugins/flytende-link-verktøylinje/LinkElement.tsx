import type { TLinkElement } from 'platejs'
import type { PlateElementProps } from 'platejs/react'
import { PlateElement } from 'platejs/react'
import { getLinkAttributes } from '@platejs/link'

export function LinkElement(props: PlateElementProps<TLinkElement>) {
  return (
    <PlateElement
      {...props}
      as="a"
      className=""
      attributes={{
        ...props.attributes,
        ...getLinkAttributes(props.editor, props.element),
        onMouseOver: (e) => {
          e.stopPropagation()
        },
      }}
    >
      {props.children}
    </PlateElement>
  )
}

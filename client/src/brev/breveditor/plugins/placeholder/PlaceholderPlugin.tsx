import { createPlatePlugin } from 'platejs/react'
import { ELEMENT_PLACEHOLDER } from './PlaceholderElement'
import { Placeholder } from './Placeholder'

export const PlaceholderPlugin = createPlatePlugin({
  key: ELEMENT_PLACEHOLDER,
  node: {
    isElement: true,
    isInline: true,
    isVoid: false,
    component: Placeholder,
  },
})

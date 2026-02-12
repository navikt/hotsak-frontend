import { TElement } from 'platejs'

export const ELEMENT_PLACEHOLDER = 'placeholder'

export interface PlaceholderElement extends TElement {
  type: typeof ELEMENT_PLACEHOLDER
  placeholder: string // hint tekst vist når tom, e.g., "skriv inn dato her"
  deletable?: boolean
  children: [{ text: string }]
}

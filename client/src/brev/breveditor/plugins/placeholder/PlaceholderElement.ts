import { TElement } from 'platejs'
import { type SpesiellePlaceholdere } from './parseTekstMedPlaceholders'

export const ELEMENT_PLACEHOLDER = 'placeholder'

export interface PlaceholderElement extends TElement {
  type: typeof ELEMENT_PLACEHOLDER
  placeholder: string // hint tekst vist når tom, e.g., "skriv inn dato her"
  autoVerdi?: typeof SpesiellePlaceholdere.FORMIDLER_NAVN
  deletable?: boolean
  children: [{ text: string }]
}

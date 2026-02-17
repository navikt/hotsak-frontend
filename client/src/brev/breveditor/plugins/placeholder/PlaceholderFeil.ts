import { Value } from 'platejs'
import { ELEMENT_PLACEHOLDER, PlaceholderElement } from './PlaceholderElement'

const EMPTY_CHAR = '\uFEFF'

export interface PlaceholderFeil {
  placeholder: string
  path: number[]
}

const hentSynligTekst = (text: string) => text.replace(new RegExp(EMPTY_CHAR, 'g'), '')

const finnTommePlaceholders = (nodes: Value, currentPath: number[] = []): PlaceholderFeil[] => {
  const feil: PlaceholderFeil[] = []

  nodes.forEach((node, index) => {
    const path = [...currentPath, index]

    if ('type' in node && node.type == ELEMENT_PLACEHOLDER) {
      const placeholderNode = node as PlaceholderElement
      const text = placeholderNode.children.map((c) => c.text).join('')
      const synligTekst = hentSynligTekst(text)

      if (synligTekst.length === 0) {
        feil.push({
          placeholder: placeholderNode.placeholder,
          path,
        })
      }
    }

    if ('children' in node && Array.isArray(node.children)) {
      feil.push(...finnTommePlaceholders(node.children as Value, path))
    }
  })
  return feil
}

export const validerPlaceholders = (value: Value): PlaceholderFeil[] => {
  return finnTommePlaceholders(value)
}

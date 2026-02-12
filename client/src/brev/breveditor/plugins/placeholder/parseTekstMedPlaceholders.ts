import { ELEMENT_PLACEHOLDER } from './PlaceholderElement'

const PLACEHOLDER_REGEX = /\[([^\]]+)\]/g

export const parseTekstMedPlaceholders = (text: string): any[] => {
  const nodes: any[] = []
  let lastIndex = 0
  let match

  while ((match = PLACEHOLDER_REGEX.exec(text)) !== null) {
    // Legge til vanlig tekst
    if (match.index > lastIndex) {
      nodes.push({ text: text.slice(lastIndex, match.index) })
    }

    // Legge til placeholder
    nodes.push({
      type: ELEMENT_PLACEHOLDER,
      placeholder: match[1], // Teksten inne i []
      deletable: true,
      children: [{ text: '\uFEFF' }], // Tom karakter for å ha noe å plassere musepeker på
    })

    lastIndex = match.index + match[0].length
  }

  // Legge til resten av tekst
  if (lastIndex < text.length) {
    nodes.push({ text: text.slice(lastIndex) })
  }

  return nodes.length > 0 ? nodes : [{ text }]
}

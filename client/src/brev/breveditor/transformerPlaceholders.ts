import { Value } from 'platejs'
import { parseTekstMedPlaceholders, PlaceholderSpesielleVerdier } from './plugins/placeholder/parseTekstMedPlaceholders'

export const transformerPlaceholders = (nodes: Value, spesielleVerdier?: PlaceholderSpesielleVerdier): Value => {
  const result: Value[number][] = []

  for (const node of nodes) {
    // hvis det er en tekstnode med placeholder-syntaks
    if ('text' in node && typeof node.text === 'string' && node.text.includes('[')) {
      const parsed = parseTekstMedPlaceholders(node.text, spesielleVerdier)
      if (parsed.length > 1 || (parsed.length === 1 && parsed[0].type)) {
        result.push(...parsed)
      } else {
        result.push(node)
      }
      continue
    }

    // Hvis node har children, transformer dem rekursivt
    if ('children' in node && Array.isArray(node.children)) {
      const transformedChildren = transformerPlaceholders(node.children as Value, spesielleVerdier)
      const flattenedChildren = transformedChildren.flat()

      // Sjekk om noen barn er blokk-erstatninger (f.eks. <ul> inne i en <p>)
      const harBlokkErstatninger = flattenedChildren.some(
        (child) => '__blockReplacement' in child && child.__blockReplacement
      )

      if (harBlokkErstatninger) {
        // Del opp parent-noden: tekst før blokken, blokken selv, tekst etter
        let currentInlineChildren: Value[number][] = []

        for (const child of flattenedChildren) {
          if ('__blockReplacement' in child && child.__blockReplacement) {
            // Legg til foregående inline-barn som en <p>
            if (currentInlineChildren.length > 0) {
              result.push({ ...node, children: currentInlineChildren })
              currentInlineChildren = []
            }
            // Legg til blokk-noden direkte (uten __blockReplacement flagget)
            const blockNode = { ...child }
            result.push(blockNode)
          } else {
            currentInlineChildren.push(child)
          }
        }

        // Legg til gjenværende inline-barn
        if (currentInlineChildren.length > 0) {
          result.push({ ...node, children: currentInlineChildren })
        }
      } else {
        result.push({ ...node, children: flattenedChildren })
      }
      continue
    }

    result.push(node)
  }

  return result as Value
}

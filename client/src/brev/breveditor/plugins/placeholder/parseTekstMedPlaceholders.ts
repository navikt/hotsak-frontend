import { ELEMENT_PLACEHOLDER } from './PlaceholderElement'

export const PLACEHOLDER_REGEX = /\[([^\]]+)\]/g

export const EMPTY_CHAR = '\uFEFF'

export const SpesiellePlaceholdere = {
  DATO_SOKNAD_MOTTATT: 'auto_dato_soknad_mottatt',
  BRUKER_NAVN: 'auto_bruker_navn',
  DATO_SOKNAD_INNSENDT: 'auto_dato_soknad_innsendt',
  FORMIDLER_NAVN: 'auto_formidler_navn',
  FORMIDLER_STILLING: 'auto_formidler_stilling',
  HJELPEMIDLER_INNVILGET: 'auto_hjelpemidler_innvilget',
  HJELPEMIDLER_AVSLATT: 'auto_hjelpemidler_avslått',
  HJELPEMIDLER_AVSLÅTT_INLINE: 'auto_hjelpemidler_avslått_inline',
  LEVERINGSTID: 'auto_leveringstid',
  ANTALL_UKER_SVARTID: 'auto_antall_uker_svartid',
  ÅRSAK: 'auto_årsak',
} as const

export type SpesiellPlaceholder = (typeof SpesiellePlaceholdere)[keyof typeof SpesiellePlaceholdere]

export const SpesiellePlaceholdereOversatt: Record<SpesiellPlaceholder, string> = {
  [SpesiellePlaceholdere.DATO_SOKNAD_MOTTATT]: 'Dato søknaden ble mottatt',
  [SpesiellePlaceholdere.BRUKER_NAVN]: 'Brukers navn',
  [SpesiellePlaceholdere.DATO_SOKNAD_INNSENDT]: 'Dato søknaden ble sendt inn',
  [SpesiellePlaceholdere.FORMIDLER_NAVN]: 'Formidlers navn',
  [SpesiellePlaceholdere.FORMIDLER_STILLING]: 'Formidlers stilling',
  [SpesiellePlaceholdere.HJELPEMIDLER_INNVILGET]: 'Hjelpemiddel innvilget',
  [SpesiellePlaceholdere.HJELPEMIDLER_AVSLATT]: 'Hjelpemiddel avslått',
  [SpesiellePlaceholdere.HJELPEMIDLER_AVSLÅTT_INLINE]: 'Hjelpemidler avslått',
  [SpesiellePlaceholdere.LEVERINGSTID]: 'Standard anslått leveringstid. Endre om upresist',
  [SpesiellePlaceholdere.ANTALL_UKER_SVARTID]: 'Forventet behandlingstid',
  [SpesiellePlaceholdere.ÅRSAK]: 'Årsak til lengre behandlingstid',
}

export interface PlaceholderSpesielleVerdier {
  [SpesiellePlaceholdere.DATO_SOKNAD_MOTTATT]?: string
  [SpesiellePlaceholdere.BRUKER_NAVN]?: string
  [SpesiellePlaceholdere.DATO_SOKNAD_INNSENDT]?: string
  [SpesiellePlaceholdere.FORMIDLER_NAVN]?: string
  [SpesiellePlaceholdere.FORMIDLER_STILLING]?: string
  [SpesiellePlaceholdere.HJELPEMIDLER_INNVILGET]?: string[]
  [SpesiellePlaceholdere.HJELPEMIDLER_AVSLATT]?: string[]
  [SpesiellePlaceholdere.HJELPEMIDLER_AVSLÅTT_INLINE]?: string[]
  [SpesiellePlaceholdere.LEVERINGSTID]?: string
  [SpesiellePlaceholdere.ANTALL_UKER_SVARTID]?: string
  [SpesiellePlaceholdere.ÅRSAK]?: string
}

export const parseTekstMedPlaceholders = (text: string, spesielleVerdier?: PlaceholderSpesielleVerdier): any[] => {
  const nodes: any[] = []
  let lastIndex = 0
  let match

  while ((match = PLACEHOLDER_REGEX.exec(text)) !== null) {
    // Legge til vanlig tekst
    if (match.index > lastIndex) {
      nodes.push({ text: text.slice(lastIndex, match.index) })
    }

    const placeholderVerdi = match[1]
    const forhåndsutfyltVerdi = spesielleVerdier?.[placeholderVerdi as keyof PlaceholderSpesielleVerdier]
    const oversattNavn = SpesiellePlaceholdereOversatt[placeholderVerdi as SpesiellPlaceholder]
    const autoVerdi =
      placeholderVerdi === SpesiellePlaceholdere.FORMIDLER_NAVN ? SpesiellePlaceholdere.FORMIDLER_NAVN : undefined

    // Legge til placeholdere
    if (forhåndsutfyltVerdi) {
      if (
        (placeholderVerdi === SpesiellePlaceholdere.HJELPEMIDLER_INNVILGET ||
          placeholderVerdi === SpesiellePlaceholdere.HJELPEMIDLER_AVSLATT) &&
        Array.isArray(forhåndsutfyltVerdi)
      ) {
        // placeholdere for hjelpemidler avslått eller innvilget, i listeform
        nodes.push({
          __blockReplacement: true,
          type: 'ul',
          children: forhåndsutfyltVerdi.map((hjelpemiddel: string) => ({
            type: 'li',
            children: [
              {
                type: 'lic',
                children: [
                  {
                    type: ELEMENT_PLACEHOLDER,
                    placeholder: oversattNavn,
                    deletable: true,
                    children: [{ text: hjelpemiddel }],
                  },
                ],
              },
            ],
          })),
        })
      } else if (
        placeholderVerdi === SpesiellePlaceholdere.HJELPEMIDLER_AVSLÅTT_INLINE &&
        Array.isArray(forhåndsutfyltVerdi)
      ) {
        // placeholdere for hjelpemidler avslått, i inline-form
        const tekst =
          forhåndsutfyltVerdi.length > 1
            ? `${forhåndsutfyltVerdi.slice(0, -1).join(', ')} og ${forhåndsutfyltVerdi.at(-1)}`
            : (forhåndsutfyltVerdi[0] ?? '')

        nodes.push({
          type: ELEMENT_PLACEHOLDER,
          placeholder: oversattNavn,
          deletable: true,
          children: [{ text: tekst }],
        })
      } else {
        // vanlige placeholdere som er ferdigutfylt - som dato for mottatt søknad
        nodes.push({
          type: ELEMENT_PLACEHOLDER,
          placeholder: oversattNavn ?? placeholderVerdi,
          deletable: true,
          ...(autoVerdi ? { autoVerdi } : {}),
          children: [{ text: forhåndsutfyltVerdi }],
        })
      }
    } else {
      // helt vanlige placeholdere som ikke er ferdig utfylt
      nodes.push({
        type: ELEMENT_PLACEHOLDER,
        placeholder: oversattNavn ?? placeholderVerdi,
        deletable: true,
        ...(autoVerdi ? { autoVerdi } : {}),
        children: [{ text: EMPTY_CHAR }],
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Legge til resten av tekst
  if (lastIndex < text.length) {
    nodes.push({ text: text.slice(lastIndex) })
  }

  return nodes.length > 0 ? nodes : [{ text }]
}

import type { Value, Descendant } from 'platejs'

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const KJENTE_MARKERINGER = ['bold', 'italic', 'underline']
const KJENTE_TYPER = ['h1', 'h2', 'h3', 'h4', 'p', 'a', 'ul', 'ol', 'li', 'lic', 'placeholder']

interface BrevTextNode {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  [key: string]: unknown
}

interface BrevElementNode {
  type?: string
  url?: string
  children?: Descendant[]
  [key: string]: unknown
}

// prøver å varsle i console i dev hvis vi støter på ukjente markeringer eller typer
const varsleUkjent = (node: Descendant) => {
  if (window.appSettings.NAIS_CLUSTER_NAME === 'dev-gcp') {
    if ('text' in node) {
      const textNode = node as BrevTextNode
      const ukjenteMarkeringer = Object.keys(textNode).filter(
        (k) => k !== 'text' && textNode[k] === true && !KJENTE_MARKERINGER.includes(k)
      )
      if (ukjenteMarkeringer.length > 0) {
        console.warn(`[serialiserTilHtml] Ukjent(e) mark(s): ${ukjenteMarkeringer.join(', ')}`, node)
      }
    } else {
      const elementNode = node as BrevElementNode
      if (elementNode.type && !KJENTE_TYPER.includes(elementNode.type)) {
        console.warn(`[serialiserTilHtml] Ukjent nodetype: "${elementNode.type}"`, node)
      }
    }
  }
}

// serialiserer data fra editor for å generere html
const serialiserNodeTilHtml = (node: Descendant): string => {
  varsleUkjent(node)

  if ('text' in node) {
    const textNode = node as BrevTextNode
    let html = escapeHtml(textNode.text ?? '')
    if (textNode.bold) html = `<strong>${html}</strong>`
    if (textNode.italic) html = `<em>${html}</em>`
    if (textNode.underline) html = `<u>${html}</u>`
    return html
  }

  const elementNode = node as BrevElementNode
  const children: string = Array.isArray(elementNode.children)
    ? elementNode.children.map(serialiserNodeTilHtml).join('')
    : ''

  switch (elementNode.type) {
    case 'h1':
      return `<h1>${children}</h1>\n`
    case 'h2':
      return `<h2>${children}</h2>\n`
    case 'h3':
      return `<h3>${children}</h3>\n`
    case 'h4':
      return `<h4>${children}</h4>\n`
    case 'p':
      return `<p>${children}</p>\n`
    case 'a': {
      const url = escapeHtml(elementNode.url ?? '')
      const linkText = children || url
      return `<a href="${url}" title="${linkText}" alt="${linkText}">${linkText}</a>`
    }
    case 'ul':
      return `<ul>${children}</ul>\n`
    case 'ol':
      return `<ol>${children}</ol>\n`
    case 'li':
      return `<li>${children}</li>\n`
    case 'lic':
      return `<span>${children}</span>`
    case 'placeholder':
      return children
    default:
      return children ? `<div>${children}</div>\n` : ''
  }
}

export const serialiserTilHtml = (value: Value): string => {
  return value.map(serialiserNodeTilHtml).join('')
}

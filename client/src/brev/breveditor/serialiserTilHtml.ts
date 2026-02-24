import type { Value } from 'platejs'
import { useMiljø } from '../../utils/useMiljø'

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const KJENTE_MARKERINGER = ['bold', 'italic', 'underline']
const KJENTE_TYPER = ['h1', 'h2', 'h3', 'h4', 'p', 'a', 'ul', 'ol', 'li', 'lic', 'placeholder']

// prøver å varsle i console i dev hvis vi støter på ukjente markeringer eller typer
const varsleUkjent = (node: any) => {
  const erDev = useMiljø()
  if (erDev) {
    if ('text' in node) {
      const ukjenteMarkeringer = Object.keys(node).filter(
        (k) => k !== 'text' && node[k] === true && !KJENTE_MARKERINGER.includes(k)
      )
      if (ukjenteMarkeringer.length > 0) {
        console.warn(`[serialiserTilHtml] Ukjent(e) mark(s): ${ukjenteMarkeringer.join(', ')}`, node)
      }
    } else if (node.type && !KJENTE_TYPER.includes(node.type)) {
      console.warn(`[serialiserTilHtml] Ukjent nodetype: "${node.type}"`, node)
    }
  }
}

// serialiserer data fra editor for å generere html
const serialiserNodeTilHtml = (node: any): string => {
  varsleUkjent(node)

  if ('text' in node) {
    let html = escapeHtml(node.text ?? '')
    if (node.bold) html = `<strong>${html}</strong>`
    if (node.italic) html = `<em>${html}</em>`
    if (node.underline) html = `<u>${html}</u>`
    return html
  }

  const children: string = Array.isArray(node.children) ? node.children.map(serialiserNodeTilHtml).join('') : ''

  switch (node.type) {
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
    case 'a':
      return `<a href="${escapeHtml(node.url ?? '')}">${children}</a>`
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

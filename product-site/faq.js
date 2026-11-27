import { parseFaq, renderFaq } from './faq-parser.mjs'

const container = document.getElementById('faq')

try {
  const response = await fetch('faq.md')
  if (!response.ok) throw new Error(`Status ${response.status}`)
  const faq = parseFaq(await response.text())
  container.innerHTML = renderFaq(faq)
  const valgt = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1)))
  if (valgt) {
    if (valgt.tagName === 'DETAILS') valgt.open = true
    valgt.scrollIntoView()
  }
} catch {
  container.innerHTML = '<p>Vi klarte ikke å hente spørsmålene. Prøv å laste inn siden på nytt.</p>'
}

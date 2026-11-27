// Sjekker at faq.md er gyldig før publisering. Kjør fra rotmappa: node product-site/scripts/valider-faq.mjs
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { links, parseFaq } from '../faq-parser.mjs'

const siteDir = join(dirname(fileURLToPath(import.meta.url)), '..')
const faqPath = join(siteDir, 'faq.md')
const faq = parseFaq(readFileSync(faqPath, 'utf8'))
const errors = [...faq.errors]

for (const { href, line } of links(faq)) {
  if (/^(https?:|mailto:)/.test(href)) continue
  const [file, anchor] = href.split('#')
  const target = join(siteDir, file || 'faq.html')
  if (!existsSync(target)) {
    errors.push({ line, message: `Lenken peker til en side som ikke finnes: ${href}` })
    continue
  }
  const isFaqAnchor =
    target === join(siteDir, 'faq.html') &&
    faq.groups.some((group) => group.id === anchor || group.questions.some((question) => question.id === anchor))
  if (anchor && !isFaqAnchor && !readFileSync(target, 'utf8').includes(`id="${anchor}"`)) {
    errors.push({ line, message: `Fant ikke avsnittet #${anchor} på ${file || 'faq.html'}.` })
  }
}

if (errors.length > 0) {
  console.error(`Fant ${errors.length} feil i product-site/faq.md:\n`)
  for (const { line, message } of errors.sort((a, b) => a.line - b.line)) {
    console.error(`  Linje ${line}: ${message}`)
    if (process.env.GITHUB_ACTIONS) console.log(`::error file=product-site/faq.md,line=${line}::${message}`)
  }
  process.exit(1)
}

const antall = faq.groups.reduce((sum, g) => sum + g.questions.length, 0)
console.log(`faq.md er gyldig: ${faq.groups.length} grupper og ${antall} spørsmål.`)

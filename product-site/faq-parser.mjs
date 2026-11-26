// Enkel Markdown-parser for faq.md. Brukes både i nettleseren (faq.js) og i valideringen (scripts/valider-faq.mjs).
// Støtter: # gruppe, ## spørsmål, avsnitt, **fet**, *kursiv*, [lenke](adresse) og punktlister med "- ".

export function parseFaq(markdown) {
  const errors = []
  const groups = []
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n')

  let group = null
  let question = null
  let paragraph = null
  let list = null
  let inComment = false

  const closeBlocks = () => {
    paragraph = null
    list = null
  }

  lines.forEach((raw, index) => {
    const lineNumber = index + 1
    const line = raw.trim()

    if (inComment) {
      if (line.includes('-->')) inComment = false
      return
    }
    if (line.startsWith('<!--')) {
      if (!line.includes('-->')) inComment = true
      return
    }
    if (line === '') {
      closeBlocks()
      return
    }

    const heading = /^(#+)\s*(.*)$/.exec(line)
    if (heading) {
      closeBlocks()
      const level = heading[1].length
      const title = heading[2].trim()
      if (level > 2) {
        errors.push({ line: lineNumber, message: `Bruk bare # (gruppe) eller ## (spørsmål). Fant ${heading[1]}.` })
        return
      }
      if (!title) {
        errors.push({ line: lineNumber, message: 'Overskriften mangler tekst.' })
        return
      }
      if (level === 1) {
        group = { title, id: slug(title), line: lineNumber, questions: [] }
        groups.push(group)
        question = null
      } else if (!group) {
        errors.push({ line: lineNumber, message: 'Spørsmålet må stå under en gruppe (# Gruppenavn).' })
      } else {
        question = { title, id: slug(title), line: lineNumber, blocks: [] }
        group.questions.push(question)
      }
      return
    }

    if (!question) {
      errors.push({ line: lineNumber, message: 'Tekst må stå under et spørsmål (## Spørsmål).' })
      return
    }

    if (/^[<>|]|^```|^\d+[.)]\s/.test(line)) {
      errors.push({
        line: lineNumber,
        message:
          'Ukjent formatering. Bruk vanlig tekst, **fet**, *kursiv*, [lenke](adresse) eller punktliste med "- ".',
      })
      return
    }

    const inlineError = checkInline(line)
    if (inlineError) {
      errors.push({ line: lineNumber, message: inlineError })
      return
    }

    const bullet = /^[-*]\s+(.*)$/.exec(line)
    if (bullet) {
      paragraph = null
      if (!list) {
        list = { type: 'list', items: [], line: lineNumber }
        question.blocks.push(list)
      }
      list.items.push(bullet[1])
      return
    }

    if (list) {
      list.items[list.items.length - 1] += ` ${line}`
      return
    }
    if (!paragraph) {
      paragraph = { type: 'paragraph', text: line, line: lineNumber }
      question.blocks.push(paragraph)
    } else {
      paragraph.text += ` ${line}`
    }
  })

  if (inComment) errors.push({ line: lines.length, message: 'En kommentar (<!--) er ikke avsluttet med -->.' })
  if (groups.length === 0) errors.push({ line: 1, message: 'Fila må ha minst én gruppe (# Gruppenavn).' })
  for (const g of groups) {
    if (g.questions.length === 0) errors.push({ line: g.line, message: `Gruppen «${g.title}» har ingen spørsmål.` })
    for (const q of g.questions) {
      if (q.blocks.length === 0) errors.push({ line: q.line, message: `Spørsmålet «${q.title}» mangler svar.` })
    }
  }
  findDuplicates(groups, 'Gruppen', errors)
  findDuplicates(
    groups.flatMap((g) => g.questions),
    'Spørsmålet',
    errors
  )

  return { groups, errors }
}

export function links(faq) {
  const result = []
  for (const g of faq.groups) {
    for (const q of g.questions) {
      for (const block of q.blocks) {
        const texts = block.type === 'list' ? block.items : [block.text]
        for (const text of texts) {
          for (const match of text.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
            result.push({ href: match[2], line: block.line })
          }
        }
      }
    }
  }
  return result
}

export function renderFaq(faq) {
  return faq.groups
    .map(
      (g) => `<section class="faq-group" aria-labelledby="${g.id}">
  <h2 id="${g.id}">${escapeHtml(g.title)}</h2>
${g.questions.map(renderQuestion).join('\n')}
</section>`
    )
    .join('\n')
}

function renderQuestion(q) {
  const blocks = q.blocks
    .map((b) =>
      b.type === 'list'
        ? `<ul>${b.items.map((item) => `<li>${renderInline(item)}</li>`).join('')}</ul>`
        : `<p>${renderInline(b.text)}</p>`
    )
    .join('\n')
  return `<details id="${q.id}">
  <summary>${escapeHtml(q.title)}</summary>
  <div class="faq-answer">${blocks}</div>
</details>`
}

function renderInline(text) {
  return escapeHtml(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, href) => {
      const external = /^https?:\/\//.test(href)
      const attrs = external ? ' target="_blank" rel="noreferrer"' : ''
      const suffix = external ? ' (åpnes i ny fane)' : ''
      return `<a href="${href}"${attrs}>${label}${suffix}</a>`
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
}

function checkInline(line) {
  const withoutLinks = line.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '$1')
  if (/\[[^\]]*\]\s*\(|\]\(/.test(withoutLinks)) {
    return 'Lenken er ikke riktig skrevet. Bruk [tekst](adresse) uten mellomrom i adressen.'
  }
  const text = withoutLinks.replace(/^[-*]\s+/, '')
  const bold = text.match(/\*\*/g)?.length ?? 0
  if (bold % 2 !== 0) return 'Fet skrift mangler avsluttende **.'
  const single = text.replace(/\*\*/g, '').match(/\*/g)?.length ?? 0
  if (single % 2 !== 0) return 'Kursiv mangler avsluttende *.'
  if (/<[a-z/!]/i.test(text)) return 'HTML er ikke tillatt. Bruk Markdown i stedet.'
  return null
}

function findDuplicates(items, label, errors) {
  const seen = new Map()
  for (const item of items) {
    if (seen.has(item.id)) {
      errors.push({
        line: item.line,
        message: `${label} «${item.title}» finnes allerede på linje ${seen.get(item.id)}.`,
      })
    } else {
      seen.set(item.id, item.line)
    }
  }
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

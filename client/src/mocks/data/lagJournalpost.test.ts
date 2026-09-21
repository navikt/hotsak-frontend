import { describe, expect, it } from 'vitest'

import { lagJournalpost } from './lagJournalpost.ts'

describe('lagJournalpost', () => {
  it('utelater behandlingstema når det ikke er angitt', () => {
    expect(lagJournalpost('9006', 'Søknad om hjelpemidler')).not.toHaveProperty('behandlingstema')
  })
})

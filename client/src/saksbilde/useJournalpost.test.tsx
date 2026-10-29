import { renderHook } from '@testing-library/react'
import { type ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { describe, expect, it } from 'vitest'

import { lagJournalpost } from '../mocks/data/lagJournalpost.ts'
import { type Journalpost } from '../types/types.internal.ts'
import { useJournalpostSuspense } from './useJournalpost.ts'

const journalpostId = 'journalpost-1'
const journalpost = lagJournalpost(journalpostId, 'Søknad')

describe('useJournalpostSuspense', () => {
  it.each([
    ['NAV 10-07.34', true],
    ['NAVe 10-07.34', true],
    ['NAV 10-07.03', false],
    [undefined, false],
  ])('returnerer riktig flagg for brevkode %s', (brevkode, forventet) => {
    const data: Journalpost = {
      ...journalpost,
      dokumenter: [{ journalpostId, dokumentId: '1', tittel: 'Søknad', brevkode, logiskeVedlegg: [] }],
    }
    const { result } = renderHook(() => useJournalpostSuspense(journalpostId), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SWRConfig
          value={{
            provider: () => new Map(),
            fallback: { [`/api/journalpost/${journalpostId}`]: data },
            fetcher: () => new Promise(() => {}),
          }}
        >
          {children}
        </SWRConfig>
      ),
    })

    expect(result.current.erBarnebrilleSøknad).toBe(forventet)
    expect(result.current.journalpost).toEqual(data)
  })

  it('returnerer false når journalposten mangler dokumenter', () => {
    const data: Journalpost = { ...journalpost, dokumenter: [] }
    const { result } = renderHook(() => useJournalpostSuspense(journalpostId), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <SWRConfig
          value={{
            provider: () => new Map(),
            fallback: { [`/api/journalpost/${journalpostId}`]: data },
            fetcher: () => new Promise(() => {}),
          }}
        >
          {children}
        </SWRConfig>
      ),
    })

    expect(result.current.erBarnebrilleSøknad).toBe(false)
  })
})

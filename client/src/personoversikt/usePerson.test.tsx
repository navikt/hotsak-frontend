import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { SWRConfig } from 'swr'
import { describe, expect, it, vi } from 'vitest'

import { http } from '../io/HttpClient.ts'
import { lagPerson } from '../mocks/data/PersonStore.ts'
import { usePerson } from './usePerson.ts'

vi.mock('../io/HttpClient.ts', () => ({ http: { post: vi.fn() } }))

const forrigePerson = { ...lagPerson(), fnr: '01010199999' }
const nyttFnr = '02020299999'

function MedTomCache({ children }: { children: ReactNode }) {
  return <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>{children}</SWRConfig>
}

describe('usePerson', () => {
  it('returnerer ikke forrige person mens ny person hentes', async () => {
    vi.mocked(http.post)
      .mockResolvedValueOnce(forrigePerson)
      .mockReturnValueOnce(new Promise(() => {}))
    const { result, rerender } = renderHook(({ fnr }) => usePerson(fnr), {
      initialProps: { fnr: forrigePerson.fnr },
      wrapper: MedTomCache,
    })
    await waitFor(() => expect(result.current.personInfo).toEqual(forrigePerson))

    rerender({ fnr: nyttFnr })

    expect(result.current.isLoading).toBe(true)
    expect(result.current.personInfo).toBeUndefined()
  })
})

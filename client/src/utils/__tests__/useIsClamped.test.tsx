import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useIsClamped } from '../useIsClamped.ts'

describe('useIsClamped', () => {
  let resizeCallbacks: Array<() => void>
  let disconnect: ReturnType<typeof vi.fn>

  beforeEach(() => {
    resizeCallbacks = []
    disconnect = vi.fn()
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resizeCallbacks.push(callback)
        }
        observe() {}
        disconnect = disconnect
      }
    )
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (name: string) => (name === '-webkit-line-clamp' ? '7' : 'hidden'),
    } as unknown as CSSStyleDeclaration)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  function lagElement(scrollHeight: number, clientHeight: number) {
    const element = document.createElement('div')
    Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true, writable: true })
    Object.defineProperty(element, 'clientHeight', { value: clientHeight, configurable: true, writable: true })
    return element
  }

  it('måler på nytt når innholdet kommer etter første måling', () => {
    const element = lagElement(0, 0)
    const { result } = renderHook(() => useIsClamped('tekst', { current: element }))
    expect(result.current).toBe(false)

    Object.defineProperty(element, 'scrollHeight', { value: 300 })
    Object.defineProperty(element, 'clientHeight', { value: 100 })
    act(() => resizeCallbacks.forEach((callback) => callback()))

    expect(result.current).toBe(true)
  })

  it('måler på nytt når størrelsen endres', () => {
    const element = lagElement(300, 100)
    const { result } = renderHook(() => useIsClamped('tekst', { current: element }))
    expect(result.current).toBe(true)

    Object.defineProperty(element, 'scrollHeight', { value: 100 })
    act(() => resizeCallbacks.forEach((callback) => callback()))

    expect(result.current).toBe(false)
  })

  it('kobler fra observatøren ved unmount', () => {
    const { unmount } = renderHook(() => useIsClamped('tekst', { current: lagElement(100, 100) }))
    unmount()
    expect(disconnect).toHaveBeenCalled()
  })
})

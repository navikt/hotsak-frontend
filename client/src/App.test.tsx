import { render, screen } from '@testing-library/react'
import { RecoilRoot } from 'recoil'
import { describe, expect, test } from 'vitest'

import App from './App'

describe('app', () => {
  test('render', () => {
    render(
      <RecoilRoot>
        <App />
      </RecoilRoot>
    )
    const element = screen.getByText(/Endringslogg/)
    expect(element).toBeDefined()
    // expect(element).toBeInTheDocument()
  })
})

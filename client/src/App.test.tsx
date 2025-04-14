import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import App from './App'

describe('app', () => {
  test('render', () => {
    render(<App />)
    const element = screen.getByText(/Endringslogg/)
    expect(element).toBeDefined()
    // expect(element).toBeInTheDocument()
  })
})

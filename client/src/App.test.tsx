import { render, screen } from '@testing-library/react'
import React from 'react'

import App from './App'

test('renders app', () => {
  render(<App />)
  const element = screen.getByText(/Endringslogg/)
  expect(element).toBeInTheDocument()
})

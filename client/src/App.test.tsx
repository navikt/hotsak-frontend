import { render, screen } from '@testing-library/react'
import React from 'react'
import { RecoilRoot } from 'recoil'

import App from './App'

test.skip('renders app', () => {
  render(
    <RecoilRoot>
      <App />
    </RecoilRoot>
  )
  const element = screen.getByText(/Endringslogg/)
  expect(element).toBeInTheDocument()
})

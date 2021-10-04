import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import React from 'react'
import { MemoryRouter } from 'react-router'

import { TabLink } from './TabLink'

describe('TabLink', () => {
  test('rendrer aktiv lenke hvis "to" er satt', () => {
    render(
      <MemoryRouter>
        <TabLink title="Test" to="/et/eller/annet/sted">
          Test
        </TabLink>
      </MemoryRouter>
    )
    expect(screen.queryByText('Test')).toBeVisible()
    expect(screen.getByRole('link')).toBeVisible()
  })
  test('rendrer disabled', () => {
    render(
      <MemoryRouter>
        <TabLink title="Test" disabled>
          Test
        </TabLink>
      </MemoryRouter>
    )
    expect(screen.queryByText('Test')).toBeVisible()
    expect(screen.queryByRole('link')).toBeNull()
  })
})

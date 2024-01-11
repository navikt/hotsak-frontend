/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import 'cypress-msw-interceptor'
import { clearIndexDb, taBrillesak } from './testUtils'

describe('Håndtering av notater på brillesaker', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('Legge til og slette notater på åpen sak', () => {
    const saksnummer = '1010'
    cy.visit(`/sak/${saksnummer}`)

    taBrillesak()

    cy.findByRole('tab', { name: /notat/i }).click()
    cy.findByRole('textbox', { name: /nytt notat/i }).type('Tekst i notatet')
    cy.findByRole('button', { name: /lagre notat/i }).click()

    cy.findByRole('list', { name: /notater/i }).within(() => {
      cy.findAllByRole('listitem').should('have.length', 1).should('include.text', 'Tekst i notatet')
      cy.findByRole('button', { name: /slett notat/i }).click()
    })

    cy.findByRole('dialog', {
      name: /er du sikker/i,
    })
      .should('be.visible')
      .within(() => {
        cy.findByRole('button', {
          name: /slett/i,
        }).click()
      })

    cy.findByRole('list', { name: /notater/i }).should('not.exist')
  })
})

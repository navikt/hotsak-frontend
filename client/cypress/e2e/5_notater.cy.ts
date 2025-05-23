/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, plukkSak } from './testUtils'

describe('Håndtering av notater på brillesaker', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  // TODO: Skipper denne testen fordi vi skal over til felles notatløsnning og da er ikke flyten under relevant.
  // Blir sannsnyligvis nye tester for felles notatløsning
  it.skip('Legge til notater på åpen sak', () => {
    plukkSak('Søknad')

    cy.findByRole('tab', { name: /notat/i }).click()
    cy.findByRole('textbox', { name: /nytt notat/i }).type('Tekst i notatet')
    cy.findByRole('button', { name: /lagre notat/i }).click()

    cy.findByRole('list', { name: /notater/i }).within(() => {
      cy.findAllByRole('listitem').should('have.length', 1).should('include.text', 'Tekst i notatet')
    })
  })
})

/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, plukkSak } from './testUtils'

describe('Saksbehandling bestilling', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('burde kunne godkjenne en bestilling', () => {
    plukkSak('1009')

    cy.findByRole('button', {
      name: /godkjenn/i,
    }).click()

    const innvilgModal = cy
      .findByRole('dialog', {
        name: /Godkjenn bestillingen/i,
      })
      .should('be.visible')

    innvilgModal.within(() => {
      // Vi har skrudd av varsler i behovsmeldingen nå, dermed er det ikke behov for å manuelt bekrefte notat til 5.17.
      // Derfor er denne kommentert ut.
      // cy.findByRole('button', { name: 'Lagre beskjed' }).click()

      cy.findByRole('button', {
        name: /Godkjenn bestillingen/i,
      }).click()
    })

    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Ferdigstilt')
  })

  it('burde kunne avvise bestilling', () => {
    plukkSak('1009')

    cy.findByRole('button', {
      name: /avvis/i,
    }).click()

    const avvisModal = cy
      .findByRole('dialog', {
        name: /vil du avvise bestillingen/i,
      })
      .should('be.visible')

    avvisModal.within(() => {
      cy.findAllByRole('radio').first().check()
      cy.findByRole('button', {
        name: /avvis bestillingen/i,
      }).click()
    })

    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Avvist')
  })
})

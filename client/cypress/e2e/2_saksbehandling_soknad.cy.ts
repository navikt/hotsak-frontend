/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, plukkSak } from './testUtils'

describe('Saksbehandling søknad', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('burde kunne innvilge en søknad', () => {
    plukkSak('Søknad')

    cy.findByRole('button', {
      name: /innvilg søknaden/i,
    }).click()

    const innvilModal = cy
      .findByRole('dialog', {
        name: /vil du innvilge søknaden/i,
      })
      .should('be.visible')

    innvilModal.within(() => {
      cy.findByRole('button', {
        name: /innvilg søknaden/i,
      }).click()
    })

    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Innvilget')
  })

  it('burde kunne overføre en søknad til Gosys', () => {
    plukkSak('Søknad')

    cy.findByRole('button', {
      name: /overfør til gosys/i,
    }).click()

    const overførModal = cy
      .findByRole('dialog', {
        name: /Vil du overføre saken til Gosys/i,
      })
      .should('be.visible')

    overførModal.within(() => {
      cy.findAllByRole('radio').first().click()
      cy.findAllByRole('checkbox').first().click()
      cy.findByRole('button', {
        name: /overfør til gosys/i,
      }).click()
    })

    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Overført til Gosys')
  })

  it('Ikke valgt årsak ved overføring til Gosys gir valideringsfeil', () => {
    plukkSak('Søknad')

    cy.findByRole('button', {
      name: /overfør til gosys/i,
    }).click()

    const overførModal = cy
      .findByRole('dialog', {
        name: /Vil du overføre saken til Gosys/i,
      })
      .should('be.visible')

    overførModal.within(() => {
      cy.findByRole('button', {
        name: /overfør til gosys/i,
      }).click()

      cy.findByText(/må fylles ut/i).should('be.visible')
    })
  })

  it('Navigering mellom tabs i søknadsbildet', () => {
    plukkSak('Søknad')

    cy.findAllByRole('tablist')
      .first()
      .within(() => {
        cy.findByRole('tab', { name: /bruker/i }).click()
      })

    cy.findByRole('heading', { level: 1, name: /hjelpemiddelbruker/i }).should('exist')

    cy.findAllByRole('tablist')
      .first()
      .within(() => {
        cy.findByRole('tab', { name: /formidler/i }).click()
      })

    cy.findByRole('heading', { level: 1, name: /formidler og opplæringsansvarlig/i }).should('exist')

    cy.findAllByRole('tablist')
      .filter(':contains("Utlånsoversikt")')
      .within(() => {
        cy.findByRole('tab', { name: /utlånsoversikt/i }).click()
      })

    cy.findAllByRole('tabpanel').filter(':contains("Utlånsoversikt")').should('exist')
  })
})

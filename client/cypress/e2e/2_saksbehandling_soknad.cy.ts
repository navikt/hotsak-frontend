/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, plukkSak } from './testUtils'

describe('Saksbehandling søknad', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('burde kunne innvilge en søknad', () => {
    plukkSak('1005')

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

  it.skip('burde kunne overføre en søknad til Gosys', () => {
    plukkSak('1005')

    cy.findByRole('button', {
      name: /overfør til gosys/i,
    }).click()

    const overførModal = cy
      .findByRole('dialog', {
        name: /overfør til gosys/i,
      })
      .should('be.visible')

    overførModal.within(() => {
      cy.findAllByRole('radio').first().click()
      cy.findByRole('button', {
        name: /overfør til gosys/i,
      }).click()
    })

    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Overført til Gosys')
  })

  it.skip('Ikke valgt årsak ved overføring til Gosys gir valideringsfeil', () => {
    plukkSak('1005')

    cy.findByRole('button', {
      name: /overfør til gosys/i,
    }).click()

    const overførModal = cy
      .findByRole('dialog', {
        name: /overfør til gosys/i,
      })
      .should('be.visible')

    overførModal.within(() => {
      cy.findByRole('button', {
        name: /overfør til gosys/i,
      }).click()

      cy.findByText(/du må velge minst en årsak i listen over/i).should('be.visible')
    })
  })

  it('Navigering mellom tabs i søknadsbildet', () => {
    plukkSak('1005')

    const tabs = cy.findAllByRole('tablist').first()

    tabs.within(() => {
      cy.findByRole('tab', { name: /bruker/i }).click()
    })

    cy.findByRole('heading', { level: 1, name: /hjelpemiddelbruker/i }).should('exist')

    tabs.within(() => {
      cy.findByRole('tab', { name: /formidler/i }).click()
    })

    cy.findByRole('heading', { level: 1, name: /formidler og opplæringsansvarlig/i }).should('exist')

    cy.findAllByRole('tablist')
      .filter(':contains("Utlånsoversikt")')
      .within(() => {
        cy.findByRole('tab', { name: /utlånsoversikt/i }).click()
      })

    cy.findAllByRole('listitem').filter(':contains("Utlånsoversikt")').should('exist')
  })
})

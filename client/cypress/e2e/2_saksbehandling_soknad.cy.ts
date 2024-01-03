/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, plukkSak } from './testUtils.cy'

describe('Saksbehandling søknad', () => {
  beforeEach(() => {
    /*cy.setCookie(
      'hotsak',
      `dev-cookie.${btoa(
        JSON.stringify({
          name: 'Silje Saksbehandler',
          NAVident: 'S112233',
          email: 'dev@nav.no',
          oid: '23ea7485-1324-4b25-a763-assdfdfa',
          groups: ['gruppe1', 'gruppe3'],
        })
      )}.ignored-part`
      )*/
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

  it('burde kunne overføre en søknad til Gosys', () => {
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
      cy.findAllByRole('checkbox').first().check()
      cy.findByRole('button', {
        name: /overfør til gosys/i,
      }).click()
    })

    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Overført til Gosys')
  })

  it('Ikke valgt årsak ved overføring til Gosys gir valideringsfeil', () => {
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

  /*it('burde kunne overføre til Gosys', () => {
    cy.visit('/sak/222222/hjelpemidler')
    cy.get('[data-cy="btn-tildel-sak-222222"]').click()
    cy.get('[data-cy="btn-vis-gosys-modal"]').should('have.text', 'Overfør til Gosys').click()
    cy.get('h1').contains('Overfør til Gosys').should('be.visible')
    cy.get('p')
      .contains(
        'Hvis du overfører saken til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre saksbehandling må gjøres manuelt i Gosys og Infotrygd.'
      )
      .should('be.visible')
    cy.get('[data-cy="overfor-soknad-arsak-0"]').click()
    cy.get('[data-cy="btn-overfor-soknad"]').should('have.text', 'Overfør til Gosys').click()
    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Overført til Gosys')
    /*
    cy.get('[data-cy="alert-vedtak-status"]').should(
      'contain.text',
      'Saken er overført til Gosys. Videre saksbehandling skjer i Gosys'
    )
    
  })*/
})

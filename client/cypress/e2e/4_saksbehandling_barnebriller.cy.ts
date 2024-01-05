/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, taBrillesak } from './testUtils.cy'

describe('Saksbehandling brillesøknad', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('burde kunne innvilge en brillesøknad', () => {
    const saksnummer = '1010'
    cy.visit(`/sak/${saksnummer}`)
    taBrillesak(saksnummer)

    cy.findByRole('textbox', { name: /fødselsnummer innsender/i }).type('1234')
    cy.findByRole('button', { name: /hent kontonummer/i }).click()
    cy.findByRole('combobox', { name: /høyre sfære/i }).select(6)
    cy.findByRole('combobox', { name: /høyre cylinder/i }).select(4)
    cy.findByRole('combobox', { name: /venstre sfære/i }).select(6)
    cy.findByRole('combobox', { name: /venstre cylinder/i }).select(6)
    cy.findByRole('textbox', { name: /brillens bestillingsdato/i }).type('02.01.2024')
    cy.findByRole('textbox', { name: /pris på brillen/i }).type('2000')
    cy.findByRole('group', { name: /inneholder bestillingen glass/i }).within(() => {
      cy.findByRole('radio', { name: /ja/i }).check()
    })
    cy.findByRole('group', { name: /er brillen bestilt hos optiker/i }).within(() => {
      cy.findByRole('radio', { name: /ja/i }).check()
    })

    cy.findByRole('button', { name: /neste/i }).click()
    cy.findByRole('button', { name: /neste/i }).click()
    cy.findByRole('button', { name: /send til godkjenning/i }).click()

    taBrillesak(saksnummer, 'Vurderer Vilkårsen')

    cy.findByRole('radio', { name: /godkjenn/i }).check()
    cy.findByRole('button', { name: /godkjenn vedtaket/i }).click()

    const godkjennModal = cy
      .findByRole('dialog', {
        name: /vil du godkjenne vedtaket/i,
      })
      .should('be.visible')

    godkjennModal.within(() => {
      cy.findByRole('button', {
        name: /godkjenn vedtak/i,
      }).click()
    })

    /*cy.findByTestId('select-bytt-bruker').select('Vurderer Vilkårsen')
    cy.findAllByRole('button').filter(':contains("Meny")')
      .first()
      .click()

      cy.findByRole('button', { name: /Ta saken/i }).click()*/

    /*cy.findByRole('button', {
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

    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Innvilget')*/
  })

  /*it('burde kunne overføre en søknad til Gosys', () => {
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

    cy.findAllByRole('listitem').filter(':contains("UTLÅNSOVERSIKT")').should('exist')
  })*/
})

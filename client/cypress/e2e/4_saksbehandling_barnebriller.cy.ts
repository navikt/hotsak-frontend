/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, taBrillesak } from './testUtils'

describe('Saksbehandling brillesøknad', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('burde kunne innvilge en brillesøknad', () => {
    const saksnummer = '1010'
    cy.visit(`/sak/${saksnummer}`)
    taBrillesak()

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

    taBrillesak('Vurderer Vilkårsen')

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

    cy.findByRole('status').should('contain', 'Vedtaket er fattet')
    cy.findByTestId('tag-sak-status').should('contain', 'Innvilget')
  })

  it('burde kunne avslå en brillesøknad', () => {
    const saksnummer = '1010'
    cy.visit(`/sak/${saksnummer}`)
    taBrillesak()

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
      cy.findByRole('radio', { name: /nei/i }).check()
    })

    cy.findByRole('textbox', { name: /begrunnelse/i }).type('En begrunnelse')
    cy.findByRole('button', { name: /neste/i }).click()
    cy.findByRole('button', { name: /neste/i }).click()
    cy.findByRole('button', { name: /send til godkjenning/i }).click()

    taBrillesak('Vurderer Vilkårsen')

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

    cy.findByRole('status').should('contain', 'Vedtaket er fattet')
    // fikse riktig status, asserte på ting i vilkårtabellen
    cy.findByTestId('tag-sak-status').should('contain', 'Avslått')
  })
})

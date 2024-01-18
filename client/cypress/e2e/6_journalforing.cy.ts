/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb } from './testUtils'

describe('Manuell journalføring og opprettelse av sak', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('Standard journalføring uten endringer på journalpost', () => {
    const journalpostid = '1004'
    cy.visit(`/oppgaveliste/dokumenter/${journalpostid}`)

    cy.findByRole('button', { name: /start journalføring/i }).click()
    cy.findByRole('button', { name: /journalfør og opprett sak/i }).click()
    cy.wait(2000)
    cy.url().should('include', '/sak/')
    cy.findByTestId('tag-sak-status').should('contain', 'Mottatt')
    cy.findByRole('table', { name: /dokumenter/i }).within(() => {
      cy.findAllByRole('row').should('have.length', 1)
      cy.findByRole('link', { name: /tilskudd ved kjøp av briller til barn/i }).should('exist')
    })
  })

  it.only('Standard journalføring uten endringer på journalpost', () => {
    const journalpostid = '1004'
    const nyDokumentTittel = 'Ny tittel på dokumentet'
    cy.visit(`/oppgaveliste/dokumenter/${journalpostid}`)
    cy.findByRole('button', { name: /start journalføring/i }).click()
    cy.findByRole('region', {
      name: /bruker det skal journalføres på/i,
    }).click()

    cy.findByRole('textbox', { name: /endre bruker/i }).type('20071359671')
    cy.findByRole('button', { name: /endre bruker/i }).click()
    cy.findByRole('textbox', { name: /dokumenttittel/i })
      .clear()
      .type(nyDokumentTittel)

    cy.findByRole('button', { name: /journalfør og opprett sak/i }).click()
    cy.wait(2000)

    cy.url().should('include', '/sak/')

    cy.findByTestId('tag-sak-status').should('contain', 'Under behandling')
    cy.findByRole('table', { name: /dokumenter/i }).within(() => {
      cy.findAllByRole('row').should('have.length', 1)
      cy.findByRole('link', { name: `${nyDokumentTittel}` }).should('exist')
    })
  })
})

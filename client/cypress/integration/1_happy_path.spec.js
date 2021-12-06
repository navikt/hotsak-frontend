/// <reference types="Cypress" />

describe('Happy path', () => {
  before(() => {
    cy.visit('/')
  })
  it('burde vise taber med riktig innhold', () => {
    cy.get('[data-cy="tab-ufordelte"]').should('have.text', 'Ufordelte saker')
    cy.get('[data-cy="tab-ufordelte"]').should('have.attr', 'aria-selected', 'true')
    cy.get('[data-cy="tab-mine"]').should('have.text', 'Mine saker')
    cy.get('[data-cy="tab-ferdigstilte"]').should('have.text', 'Ferdigstilte saker')
    cy.get('[data-cy="tab-alle"]').should('have.text', 'Alle saker')
    cy.get('[data-cy="tab-overførtGosys"]').should('have.text', 'Overført til Gosys')
  })

  it('burde kunne starte en ufordelt sak', () => {
    cy.get('[data-cy="btn-tildel-sak-222222"]').click()
    cy.url().should('include', '/sak/222222/hjelpemidler')
  })

  it('burde kunne innvilge en søknad', () => {
    cy.get('[data-cy="btn-vis-vedtak-modal"]').should('have.text', 'Innvilg søknaden').click()
    cy.get('h1').contains('Vil du innvilge søknaden?').should('be.visible')
    cy.get('p')
      .contains(
        'Ved å innvilge søknaden blir det fattet et vedtak i saken og opprettet en serviceforespørsel i OEBS. Innbygger vil få beskjed om vedtaket på Ditt NAV.'
      )
      .should('be.visible')
    cy.get('[data-cy="btn-innvilg-soknad"]').should('have.text', 'Innvilg søknaden').click()
    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Innvilget')
    cy.get('[data-cy="alert-vedtak-status"]').should('contain.text', 'Innvilget 29.03.2021 av Silje Saksbehandler')
  })

  it('burde kunne overføre til Gosys', () => {
    // re-visit URL to clear state
    cy.visit('/sak/222222/hjelpemidler')
    cy.get('[data-cy="btn-tildel-sak-222222"]').click()
    cy.get('[data-cy="btn-vis-gosys-modal"]').should('have.text', 'Overfør til Gosys').click()
    cy.get('h1').contains('Vil du overføre saken til Gosys?').should('be.visible')
    cy.get('p')
      .contains(
        'Hvis saken overføres til Gosys, vil den dukke opp som en vanlig journalføringsoppgave. Journalføring og videre saksbehandling må gjøres manuelt i Gosys og Infotrygd.'
      )
      .should('be.visible')
    cy.get('[data-cy="btn-overfor-soknad"]').should('have.text', 'Overfør saken').click()
    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Overført til Gosys')
    cy.get('[data-cy="alert-vedtak-status"]').should(
      'contain.text',
      'Saken er overført til Gosys. Videre saksbehandling skjer i Gosys'
    )
  })
})

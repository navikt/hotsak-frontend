/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />
describe('Happy path', () => {
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
    cy.clearIndexedDb('SaksbehandlerStore')
    cy.clearIndexedDb('PersonStore')
    cy.clearIndexedDb('HjelpemiddelStore')
    cy.clearIndexedDb('JournalpostStore')
    cy.clearIndexedDb('SakStore')
    cy.clearIndexedDb('BarnebrillesakStore')
  })

  it('burde kunne starte en ufordelt sak', () => {
    cy.visit('/')
    cy.findAllByRole('button', { name: /Ta saken/i })
      .first()
      .click()
    cy.url().should('include', '/sak/1005/hjelpemidler')
  })

  it('burde kunne innvilge en søknad', () => {
    cy.visit('/')
    cy.findAllByRole('button', { name: /Ta saken/i })
      .first()
      .click()
    cy.url().should('include', '/sak/1005/hjelpemidler')

    cy.findByRole('button', {
      name: /innvilg søknaden/i,
    }).click()

    /* cy.get('[data-cy="btn-vis-vedtak-modal"]').should('have.text', 'Innvilg søknaden').click()
    cy.get('h1').contains('Vil du innvilge søknaden?').should('be.visible')
    cy.get('p')
      .contains(
        'Ved å innvilge søknaden blir det fattet et vedtak i saken og opprettet en serviceforespørsel i OEBS. Innbygger vil få beskjed om vedtaket på Ditt NAV.'
      )
      .should('be.visible')
    cy.get('[data-cy="btn-innvilg-soknad"]').should('have.text', 'Innvilg søknaden').click()
    cy.get('[data-cy="tag-soknad-status"]').should('have.text', 'Innvilget')
    //cy.get('[data-cy="alert-vedtak-status"]').should('contain.text', 'Innvilget 29.03.2021 av Silje Saksbehandler')*/
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

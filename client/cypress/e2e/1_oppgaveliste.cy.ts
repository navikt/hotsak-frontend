/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />
describe('Oppgaveliste', () => {
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
  })

  it('burde kunne starte en ufordelt sak', () => {
    cy.visit('/')
    cy.findAllByRole('button', { name: /Ta saken/i })
      .first()
      .click()
    cy.url().should('include', '/sak/1005/hjelpemidler')
  })
})

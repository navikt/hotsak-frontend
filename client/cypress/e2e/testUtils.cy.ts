export const clearIndexDb = () => {
  cy.clearIndexedDb('SaksbehandlerStore')
  cy.clearIndexedDb('PersonStore')
  cy.clearIndexedDb('HjelpemiddelStore')
  cy.clearIndexedDb('JournalpostStore')
  cy.clearIndexedDb('SakStore')
  cy.clearIndexedDb('BarnebrillesakStore')
}

export const plukkSak = (saksnummer: string) => {
  cy.visit(`/sak/${saksnummer}/hjelpemidler`)
  cy.findAllByRole('button', { name: /Ta saken/i })
    .first()
    .click()
}

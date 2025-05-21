export const clearIndexDb = () => {
  cy.clearIndexedDb('SaksbehandlerStore')
  cy.clearIndexedDb('PersonStore')
  cy.clearIndexedDb('HjelpemiddelStore')
  cy.clearIndexedDb('JournalpostStore')
  cy.clearIndexedDb('OppgaveStore')
  cy.clearIndexedDb('SakStore')
}

export const plukkSak = (sakstype: 'Søknad' | 'Bestilling' | 'Tilskudd') => {
  cy.visit('/')

  cy.findByLabelText(/Sakstype/i).select('Søknad')

  cy.findAllByRole('button', { name: /Ta saken/i })
    .first()
    .click()
}

export const fortsettSaksbehandling = () => {
  cy.findAllByRole('button').filter(':contains("Meny")').first().click()
  cy.findAllByRole('button', { name: /Fortsett behandling/i }).click()
}

export const taBrillesak = (saksbehandler: string = 'Silje Saksbehandler') => {
  cy.findByTestId('select-bytt-bruker').select(saksbehandler)
  cy.wait(1000)
  cy.findByTitle(/saksmeny/i).click()
  cy.findByRole('button', { name: /Ta saken/i }).click()
}

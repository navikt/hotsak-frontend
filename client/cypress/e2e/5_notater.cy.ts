/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, plukkSak } from './testUtils'

describe('Håndtering av notater', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('skal kunne opprette et internt notat med tittel og tekst', () => {
    plukkSak('Søknad')
    cy.findByRole('tab', { name: /notater/i }).click()
    cy.findByRole('radio', { name: /internt arbeidsnotat/i }).click({ force: true })

    cy.get('form[name="internt-notat-form"]').within(() => {
      cy.findAllByRole('textbox').eq(0).type('Tittel på internt notat')
      cy.findAllByRole('textbox').eq(1).type('Tekst i det interne notatet')
    })

    cy.findByRole('button', { name: /opprett internt notat/i }).click()

    cy.findAllByTestId(/notat-card/i)
      .should('have.length.at.least', 2) // Fordi det allerede ligger et ferdig notat der i testdatane
      .first()
      .should('contain.text', 'Tittel på internt notat')
      .and('contain.text', 'Tekst i det interne notatet')
  })

  it('skal kunne opprette et forvaltningsnotat interne saksopplysninger med tittel og tekst', () => {
    plukkSak('Søknad')
    cy.findByRole('tab', { name: /notater/i }).click()
    cy.findByRole('radio', { name: /forvaltningsnotat/i }).click({ force: true })

    cy.get('form[name="forvaltningsnotat-form"]').within(() => {
      cy.findByRole('radio', { name: /Interne saksopplysninger/i }).check()
      cy.findAllByRole('textbox').eq(0).type('Tittel på forvaltningsnotat')
      cy.findAllByRole('textbox').eq(1).type('Tekst i forvaltningsnotat')
    })

    cy.findByRole('button', { name: /journalfør notat/i }).click()

    cy.findAllByTestId(/notat-card/i)
      .should('have.length.at.least', 2) // Fordi det allerede ligger et ferdig notat der i testdatane
      .first()
      .should('contain.text', 'Tittel på forvaltningsnotat')
      .and('contain.text', 'Tekst i forvaltningsnotat')
  })

  it('skal kunne opprette et forvaltningsnotat eksterne saksopplysninger med tittel og tekst', () => {
    plukkSak('Søknad')
    cy.findByRole('tab', { name: /notater/i }).click()
    cy.findByRole('radio', { name: /forvaltningsnotat/i }).click({ force: true })

    cy.get('form[name="forvaltningsnotat-form"]').within(() => {
      cy.findByRole('radio', { name: /Eksterne saksopplysninger/i }).check()
      cy.findAllByRole('textbox').eq(0).type('Tittel på forvaltningsnotat')
      cy.findAllByRole('textbox').eq(1).type('Tekst i forvaltningsnotat')
    })

    cy.findByRole('button', { name: /journalfør notat/i }).click()
    const bekreftModal = cy
      .findByRole('dialog', {
        name: /er du sikker på at du vil journalføre notatet/i,
      })
      .should('be.visible')

    bekreftModal.within(() => {
      cy.findByRole('checkbox').check()
      cy.findByRole('button', { name: /Ja, journalfør notatet/i }).click()
    })

    cy.findAllByTestId(/notat-card/i)
      .should('have.length.at.least', 2) // Fordi det allerede ligger et ferdig notat der i testdatane
      .first()
      .should('contain.text', 'Tittel på forvaltningsnotat')
      .and('contain.text', 'Synlig for bruker')
      .and('contain.text', 'Tekst i forvaltningsnotat')
  })

  it('skal kunne feilregistrere notat', () => {
    plukkSak('Søknad')
    cy.findByRole('tab', { name: /notater/i }).click()

    cy.findAllByTestId(/notat-card/i)
      .first()
      .within(() => {
        cy.findByRole('button').click()
      })
    cy.findByRole('menuitem', { name: /feilregistrer/i })
      .should('be.visible')
      .click()

    cy.findByRole('dialog', {
      name: /Er du sikker på at du vil feilregistrere forvaltningsnotatet/i,
    })
      .should('be.visible')
      .within(() => {
        cy.findAllByRole('radio').first().check()
        cy.findByRole('button', { name: /ja, feilregistrer forvaltningsnotatet/i }).click()
      })
    cy.findAllByTestId(/notat-card/i).should('have.length', 0)
  })

  it('skal lagre utkast når tittel eller tekst endres', () => {
    plukkSak('Søknad')
    cy.findByRole('tab', { name: /notater/i })
      .should('be.visible')
      .click()
    cy.findByRole('radio', { name: /internt arbeidsnotat/i }).click({ force: true })

    cy.findByTestId('utkast-lagret').should('not.exist')
    cy.findByTestId('utkast-badge').should('not.exist')
    cy.findByTestId('notatteller').should('contain.text', '1')

    cy.get('form[name="internt-notat-form"]').within(() => {
      cy.findAllByRole('textbox').eq(0).type('Tittel på internt notat')
    })

    cy.findByTestId('utkast-lagret').should('be.visible')
    cy.findByTestId('utkast-badge').should('be.visible')
    cy.findByTestId('notatteller').should('contain.text', '2')

    cy.findByRole('button', { name: /slett utkast/i }).click()
    cy.findByRole('button', { name: /ja, slett utkast/i })
      .should('be.visible')
      .click()

    cy.findByTestId('utkast-lagret').should('not.exist')
    cy.findByTestId('utkast-badge').should('not.exist')
    cy.findByTestId('notatteller').should('contain.text', '1')

    cy.findByRole('radio', { name: /forvaltningsnotat/i }).click({ force: true })
    cy.get('form[name="forvaltningsnotat-form"]').within(() => {
      cy.findAllByRole('textbox').eq(1).type('Tekst i forvaltningsnotatet')
    })

    cy.findByTestId('utkast-lagret').should('be.visible')
    cy.findByTestId('utkast-badge').should('be.visible')
    cy.findByTestId('notatteller').should('contain.text', '2')
  })

  it('innvilgelse av søknad stoppes hvis saken har aktive notatutkast', () => {
    plukkSak('Søknad')
    cy.findByRole('tab', { name: /notater/i })
      .should('be.visible')
      .click()
    cy.findByRole('radio', { name: /internt arbeidsnotat/i }).click({ force: true })

    cy.get('form[name="internt-notat-form"]').within(() => {
      cy.findAllByRole('textbox').eq(0).type('Tittel på internt notat')
    })

    cy.findByRole('button', { name: /innvilg søknaden/i }).click()
    cy.contains('h3', 'For å gå videre må du rette opp følgende:')
      .next('ul')
      .should('contain.text', 'Du har et utkast til notat som må ferdigstilles eller slettes')

    cy.findByRole('button', { name: /slett utkast/i }).click()
    cy.findByRole('button', { name: /ja, slett utkast/i })
      .should('be.visible')
      .click()

    cy.findByRole('button', { name: /innvilg søknaden/i }).click()
    cy.findByRole('dialog', { name: /vil du innvilge søknaden/i }).should('be.visible')
  })

  it.only('overføring av søknad til gosys stoppes hvis saken har aktive notatutkast', () => {
    plukkSak('Søknad')
    cy.findByRole('tab', { name: /notater/i })
      .should('be.visible')
      .click()
    cy.findByRole('radio', { name: /internt arbeidsnotat/i }).click({ force: true })

    cy.get('form[name="internt-notat-form"]').within(() => {
      cy.findAllByRole('textbox').eq(0).type('Tittel på internt notat')
    })

    cy.findByRole('button', { name: /overfør til gosys/i }).click()
    cy.contains('h3', 'For å gå videre må du rette opp følgende:')
      .next('ul')
      .should('contain.text', 'Du har et utkast til notat som må ferdigstilles eller slettes')
    cy.findByRole('dialog', { name: /vil du overføre saken til gosys/i }).should('not.exist')

    cy.findByRole('button', { name: /slett utkast/i }).click()
    cy.findByRole('button', { name: /ja, slett utkast/i })
      .should('be.visible')
      .click()

    cy.findByRole('button', { name: /overfør til gosys/i })
      .should('be.visible')
      .click()
    cy.findByRole('dialog', { name: /vil du overføre saken til gosys/i }).should('be.visible')
  })
})

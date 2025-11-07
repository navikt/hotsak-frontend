/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, plukkSak } from './testUtils'

describe('Håndtering av notater', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('skal kunne opprette et internt notat med tittel og tekst', () => {
    åpnetNotatTab()
    lagInterntNotat()

    assertNotatInnholdEr('Tittel på internt notat', 'Tekst i det interne notatet')
  })

  it('skal kunne opprette et forvaltningsnotat interne saksopplysninger med tittel og tekst', () => {
    åpnetNotatTab()
    lagForvaltningsNotat('Interne saksopplysninger')

    assertNotatInnholdEr('Tittel på forvaltningsnotat', 'Tekst i forvaltningsnotat')
  })

  it('skal kunne opprette et forvaltningsnotat eksterne saksopplysninger med tittel og tekst', () => {
    åpnetNotatTab()
    cy.findByRole('radio', { name: /forvaltningsnotat/i }).click({ force: true })

    lagForvaltningsNotat('Eksterne saksopplysninger')

    const bekreftModal = cy
      .findByRole('dialog', {
        name: /er du sikker på at du vil journalføre notatet/i,
      })
      .should('be.visible')

    bekreftModal.within(() => {
      cy.findByRole('checkbox').check()
      cy.findByRole('button', { name: /Ja, journalfør notatet/i }).click()
    })

    assertNotatInnholdEr('Tittel på forvaltningsnotat', 'Tekst i forvaltningsnotat')
    cy.findAllByTestId(/notat-card/i).should('contain.text', 'Synlig for bruker')
  })

  it('skal kunne feilregistrere notat', () => {
    åpnetNotatTab()

    feilregistrerNotat()
    cy.findAllByTestId(/notat-card/i).should('have.length', 0)
  })

  it('skal lagre utkast når tittel eller tekst endres', () => {
    åpnetNotatTab()
    cy.findByRole('radio', { name: /internt arbeidsnotat/i }).click({ force: true })

    assertUtkastEr('ikke synlig')
    assertNotattellerEr('1')

    cy.get('form[name="internt-notat-form"]').within(() => {
      cy.findAllByRole('textbox').eq(0).type('Tittel på internt notat')
    })

    assertUtkastEr('synlig')
    assertNotattellerEr('2')
    slettUtkast()
    assertUtkastEr('ikke synlig')
    assertNotattellerEr('1')

    cy.findByRole('radio', { name: /forvaltningsnotat/i }).click({ force: true })
    cy.get('form[name="forvaltningsnotat-form"]').within(() => {
      cy.findAllByRole('textbox').eq(1).type('Tekst i forvaltningsnotatet')
    })

    assertUtkastEr('synlig')
    assertNotattellerEr('2')
  })

  it('innvilgelse av søknad stoppes hvis saken har aktive notatutkast', () => {
    åpnetNotatTab()
    cy.findByRole('radio', { name: /internt arbeidsnotat/i }).click({ force: true })

    cy.get('form[name="internt-notat-form"]').within(() => {
      cy.findAllByRole('textbox').eq(0).type('Tittel på internt notat')
    })

    cy.findByRole('button', { name: /innvilg søknaden/i }).click()
    cy.contains('h3', 'For å gå videre må du rette opp følgende:')
      .next('ul')
      .should('contain.text', 'Du har et utkast til notat som må ferdigstilles eller slettes.')

    slettUtkast()
    assertUtkastEr('ikke synlig')

    cy.findByRole('button', { name: /innvilg søknaden/i })
      .should('be.visible')
      .click()
    cy.findByRole('dialog', { name: /vil du innvilge søknaden/i }).should('be.visible')
  })

  it('overføring av søknad til gosys stoppes hvis saken har aktive notatutkast', () => {
    åpnetNotatTab()
    cy.findByRole('radio', { name: /internt arbeidsnotat/i }).click({ force: true })

    cy.get('form[name="internt-notat-form"]').within(() => {
      cy.findAllByRole('textbox').eq(0).type('Tittel på internt notat')
    })

    cy.findByRole('button', { name: /overfør til gosys/i }).click()
    cy.contains('h3', 'For å gå videre må du rette opp følgende:')
      .next('ul')
      .should('contain.text', 'Du har et utkast til notat som må ferdigstilles eller slettes.')
    cy.findByRole('dialog', { name: /vil du overføre saken til gosys/i }).should('not.exist')

    slettUtkast()
    assertUtkastEr('ikke synlig')

    cy.findByRole('button', { name: /overfør til gosys/i })
      .should('be.visible')
      .click()
    cy.findByRole('dialog', { name: /vil du overføre saken til gosys/i }).should('be.visible')
  })
})

function lagInterntNotat() {
  cy.findByRole('radio', { name: /internt arbeidsnotat/i }).click({ force: true })
  cy.get('form[name="internt-notat-form"]').within(() => {
    cy.findAllByRole('textbox').eq(0).type('Tittel på internt notat')
    cy.findAllByRole('textbox').eq(1).type('Tekst i det interne notatet')
  })

  cy.findByRole('button', { name: /opprett internt notat/i }).click()
}

function assertNotatInnholdEr(tittel: string, tekst: string) {
  cy.findAllByTestId(/notat-card/i)
    .should('have.length.at.least', 2) // Fordi det allerede ligger et ferdig notat der i testdatane
    .first()
    .should('contain.text', tittel)
    .and('contain.text', tekst)
}

function feilregistrerNotat() {
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
}

function assertUtkastEr(synlig: 'synlig' | 'ikke synlig') {
  if (synlig === 'synlig') {
    cy.findByTestId('utkast-lagret').should('be.visible')
    cy.findByTestId('utkast-badge').should('be.visible')
  } else {
    cy.findByTestId('utkast-lagret').should('not.exist')
    cy.findByTestId('utkast-badge').should('not.exist')
  }
}

function assertNotattellerEr(antall: string) {
  cy.findByTestId('notatteller').should('contain.text', antall)
}

function åpnetNotatTab() {
  plukkSak('Søknad')
  cy.findByRole('tab', { name: /notater/i }).click()
}

function lagForvaltningsNotat(klassifisering: 'Interne saksopplysninger' | 'Eksterne saksopplysninger') {
  cy.findByRole('radio', { name: /forvaltningsnotat/i }).click({ force: true })

  cy.get('form[name="forvaltningsnotat-form"]').within(() => {
    cy.findByRole('radio', { name: new RegExp(klassifisering, 'i') }).check()
    cy.findAllByRole('textbox').eq(0).type('Tittel på forvaltningsnotat')
    cy.findAllByRole('textbox').eq(1).type('Tekst i forvaltningsnotat')

    cy.findByRole('button', { name: /journalfør notat/i }).click()
  })
}

function slettUtkast() {
  cy.findByRole('button', { name: /slett utkast/i }).click()
  cy.findByRole('dialog', {
    name: /er du sikker på at du vil slette/i,
  })
    .should('be.visible')
    .within(() => {
      cy.findByRole('button', { name: /ja, slett utkast/i })
        .should('be.visible')
        .click()
    })
  cy.findByRole('dialog', {
    name: /er du sikker på at du vil slette/i,
  }).should('not.exist')
}

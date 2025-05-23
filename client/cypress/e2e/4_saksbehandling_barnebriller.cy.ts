/// <reference types="Cypress" />
/// <reference types="@testing-library/cypress" />

import { clearIndexDb, fortsettSaksbehandling, plukkSak, byttSaksbehandler } from './testUtils'

describe('Saksbehandling brillesøknad', () => {
  beforeEach(() => {
    clearIndexDb()
  })

  it('burde kunne innvilge en brillesøknad', () => {
    plukkSak('Tilskudd')

    cy.findByRole('textbox', { name: /fødselsnummer innsender/i }).type('1234')
    cy.findByRole('button', { name: /hent kontonummer/i }).click()
    cy.findByRole('combobox', { name: /høyre sfære/i }).select(6)
    cy.findByRole('combobox', { name: /høyre cylinder/i }).select(4)
    cy.findByRole('combobox', { name: /venstre sfære/i }).select(6)
    cy.findByRole('combobox', { name: /venstre cylinder/i }).select(6)

    const date30DaysAgo = new Date(new Date().getTime() - 60 * 60 * 24 * 1000 * 30)
    const formattedDate = `01.${`0${date30DaysAgo.getMonth() + 1}`.slice(-2)}.${date30DaysAgo.getFullYear()}`
    cy.findByRole('textbox', { name: /brillens bestillingsdato/i }).type(formattedDate)

    cy.findByRole('textbox', { name: /pris på brillen/i }).type('2000')
    cy.findByRole('group', { name: /inneholder bestillingen glass/i }).within(() => {
      cy.findByRole('radio', { name: /ja/i }).check()
    })
    cy.findByRole('group', { name: /er brillen bestilt hos optiker/i }).within(() => {
      cy.findByRole('radio', { name: /ja/i }).check()
    })
    cy.findByRole('button', { name: /neste/i }).click()
    cy.wait(1000)
    cy.findByRole('button', { name: /neste/i }).click()
    cy.findByRole('button', { name: /send til godkjenning/i }).click()
    cy.findByTestId('tag-sak-status').should('contain', 'Til godkjenning')

    byttSaksbehandler('Vurderer Vilkårsen')

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

  it('Manuell overstyring av vilkår', () => {
    const bestillingsdatoForLangtTilbakeITid = '01.01.2023'

    plukkSak('Tilskudd')
    cy.wait(1000)

    cy.findByRole('textbox', { name: /fødselsnummer innsender/i }).type('1234')
    cy.findByRole('button', { name: /hent kontonummer/i }).click()
    cy.findByRole('combobox', { name: /høyre sfære/i }).select(6)
    cy.findByRole('combobox', { name: /høyre cylinder/i }).select(4)
    cy.findByRole('combobox', { name: /venstre sfære/i }).select(6)
    cy.findByRole('combobox', { name: /venstre cylinder/i }).select(6)
    cy.findByRole('textbox', { name: /brillens bestillingsdato/i }).type(bestillingsdatoForLangtTilbakeITid)
    cy.findByRole('textbox', { name: /pris på brillen/i }).type('2000')
    cy.findByRole('group', { name: /inneholder bestillingen glass/i }).within(() => {
      cy.findByRole('radio', { name: /ja/i }).check()
    })
    cy.findByRole('group', { name: /er brillen bestilt hos optiker/i }).within(() => {
      cy.findByRole('radio', { name: /ja/i }).check()
    })
    cy.findByRole('button', { name: /neste/i }).click()
    cy.wait(3000)

    cy.findByTestId('tag-vilkår-status').should('exist').should('contain', 'Avslag')
    cy.findByRole('table').within(() => {
      cy.findAllByText('Ikke oppfylt').should('have.length', 1)
      cy.findByRole('row', { name: /ikke oppfylt/i }).within(() => {
        cy.findByRole('button', { name: /vis mer/i }).click()
      })
    })

    cy.findByRole('radio', { name: /ja/i }).check()
    cy.findByRole('textbox', { name: /begrunnelse/i }).type('Begrunnelse for overstyring')
    cy.findByRole('button', { name: /lagre/i }).click()

    cy.findByTestId('tag-vilkår-status').should('exist').should('contain', 'Innvilget')
    cy.findByRole('table').within(() => {
      cy.findAllByText('Ikke oppfylt').should('have.length', 0)
      cy.findAllByTestId('alert-vilkårstatus').should('have.length', 8)
    })
  })

  it('burde kunne avslå en brillesøknad', () => {
    plukkSak('Tilskudd')

    /* Registrer søknad  */
    cy.findByRole('textbox', { name: /fødselsnummer innsender/i }).type('1234')
    cy.findByRole('button', { name: /hent kontonummer/i }).click()
    cy.findByRole('combobox', { name: /høyre sfære/i }).select(6)
    cy.findByRole('combobox', { name: /høyre cylinder/i }).select(4)
    cy.findByRole('combobox', { name: /venstre sfære/i }).select(6)
    cy.findByRole('combobox', { name: /venstre cylinder/i }).select(6)

    const date30DaysAgo = new Date(new Date().getTime() - 60 * 60 * 24 * 1000 * 30)
    const formattedDate = `01.${`0${date30DaysAgo.getMonth() + 1}`.slice(-2)}.${date30DaysAgo.getFullYear()}`
    cy.findByRole('textbox', { name: /brillens bestillingsdato/i }).type(formattedDate)

    cy.findByRole('textbox', { name: /pris på brillen/i }).type('2000')
    cy.findByRole('group', { name: /inneholder bestillingen glass/i }).within(() => {
      cy.findByRole('radio', { name: /ja/i }).check()
    })
    cy.findByRole('group', { name: /er brillen bestilt hos optiker/i }).within(() => {
      cy.findByRole('radio', { name: /nei/i }).check()
    })

    cy.findByRole('textbox', { name: /begrunnelse/i }).type('En begrunnelse')
    cy.findByRole('button', { name: /neste/i }).click()

    /* Vilkårsvurdering */
    cy.wait(1000)

    cy.findByRole('heading', { name: /oversikt vilkår/i })
    cy.findByTestId('tag-vilkår-status').should('exist').should('contain', 'Avslag')
    cy.findByRole('table').within(() => {
      cy.findAllByText('Ikke oppfylt').should('have.length', 1)
    })

    cy.findByRole('button', { name: /neste/i }).click()

    /* Vedtak */
    cy.findByRole('button', { name: /send til godkjenning/i }).click()
    cy.findByTestId('tag-sak-status').should('contain', 'Til godkjenning')

    /* Totrinnskontroll */
    cy.wait(2000)
    byttSaksbehandler('Vurderer Vilkårsen')

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
    cy.findByTestId('tag-sak-status').should('contain', 'Avslått')
  })

  it('burde kunne avslå en brillesøknad på grunn av manglende opplysninger', () => {
    plukkSak('Tilskudd')

    /* Registrer søknad  */
    cy.findByRole('group', { name: /inneholder bestillingen glass/i }).within(() => {
      cy.findByRole('radio', { name: /opplysninger mangler/i }).check()
    })
    cy.findByRole('group', { name: /er brillen bestilt hos optiker/i }).within(() => {
      cy.findByRole('radio', { name: /opplysninger mangler/i }).check()
    })

    cy.findByRole('button', { name: /neste/i }).click()

    /* Vilkårsvurdering */
    cy.wait(1000)

    cy.findByRole('heading', { name: /oversikt vilkår/i })
    cy.findByTestId('tag-vilkår-status').should('exist').should('contain', 'Avslag')
    cy.findByRole('table').within(() => {
      cy.findAllByText('Mangler opplysninger').should('have.length', 7)
    })

    cy.findByRole('button', { name: /neste/i }).click()
    cy.findByRole('status').should('include.text', 'Mangler innhente opplysninger brev').should('exist')

    /* Send innhente opplysnigner brev */
    cy.findByRole('tab', { name: /send brev/i }).click()

    cy.findByTestId('utviklerverktoy-lukk').click()

    cy.findByRole('textbox', { name: /fritekst/i }).type('Fritekst til brevet')
    cy.findByRole('button', { name: /send brev/i }).click()

    cy.findByRole('dialog', {
      name: /vil du sende brevet/i,
    })
      .should('be.visible')
      .within(() => {
        cy.findByRole('button', {
          name: /send brev/i,
        }).click()
      })

    cy.findByRole('link', { name: 'Innhent opplysninger' }).should('exist')

    cy.findByTestId('tag-sak-status').should('contain', 'Avventer opplysninger')
    fortsettSaksbehandling()

    /* Avslagsbrev med fritekst */
    cy.findByRole('textbox', { name: /beskriv hvilke opplysninger som mangler/i }).type(
      'Beskrivelse av årsak til avslag'
    )
    cy.findByRole('button', { name: /send til godkjenning/i }).click()
    cy.findByTestId('tag-sak-status').should('contain', 'Til godkjenning')
  })
})

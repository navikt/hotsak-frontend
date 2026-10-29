import { expect, test } from '@playwright/test'

import { åpneJournalføringsoppgave } from './helpers'

function ventPåJournalføring(page: import('@playwright/test').Page) {
  return page.waitForResponse((response) => {
    const path = new URL(response.url()).pathname
    return response.request().method() === 'POST' && /\/api\/journalpost\/[^/]+\/journalforing$/.test(path)
  })
}

async function velgGjelder(page: import('@playwright/test').Page) {
  await page.getByRole('combobox', { name: 'Gjelder' }).fill('ganghjelpemiddel')
  await page
    .getByRole('option', { name: /Ganghjelpemiddel/i })
    .first()
    .click()
}

async function hentParter(page: import('@playwright/test').Page) {
  return page.evaluate(async () => {
    const response = await fetch('/api/journalpost/9006')
    if (!response.ok) throw new Error('Kunne ikke hente testjournalpost')
    const journalpost: { fnrBruker: string; fnrInnsender: string } = await response.json()
    if (!journalpost.fnrBruker || !journalpost.fnrInnsender) throw new Error('Testjournalposten mangler part')
    return { brukerFnr: journalpost.fnrBruker, avsenderFnr: journalpost.fnrInnsender }
  })
}

test.describe('Journalføring', () => {
  test('viser annet innhold fra logiske vedlegg på 10-07.86-oppgaven', async ({ page }) => {
    await page.goto('/oppgave/109009')
    await expect(page.getByRole('heading', { level: 1, name: 'Journalføring' })).toBeVisible()
    await expect(page.getByText('Fnr: 010101 99999')).toBeVisible()
    await expect(page.getByText(/ - 01010199999$/)).toBeVisible()
    await expect(page.getByText(/ - 02020299999$/)).toBeVisible()
    await expect(page.getByRole('combobox', { name: 'Dokumenttittel (1 av 1)' })).toHaveValue(
      'NAV 10-07.86: Søknad om hjelpemiddel til kognisjon, kommunikasjon og lese- og skrivevansker'
    )
    await expect(page.getByText('Uttalelse fra fagperson om diagnose og funksjonsevne', { exact: true })).toBeVisible()
    await expect(page.getByText('Annen dokumentasjon', { exact: true })).toHaveCount(0)
  })

  test('kan koble en journalpost til en eksisterende Hotsak-sak og navigere til saken', async ({ page }) => {
    await åpneJournalføringsoppgave(page)
    const { brukerFnr } = await hentParter(page)
    const nyAvsenderFnr = '02020299999'
    await page.getByRole('button', { name: 'Endre avsender' }).click()
    await page.getByRole('textbox', { name: 'Avsenders fødselsnummer' }).fill(nyAvsenderFnr)
    await page.getByRole('button', { name: 'Velg avsender' }).click()
    await expect(page.getByRole('textbox', { name: 'Avsenders fødselsnummer' })).toBeHidden()
    await expect(page.getByText(`Fnr: ${brukerFnr.slice(0, 6)} ${brukerFnr.slice(6)}`)).toBeVisible()
    await velgGjelder(page)

    const kobleTilSak = page.getByRole('radio', { name: /^Koble til sak \(\d+\)$/ })
    await expect(kobleTilSak).toBeVisible()
    await kobleTilSak.click()
    await page.getByRole('radio', { name: /Velg sak 9901:/ }).check()

    const journalføringRequest = page.waitForRequest(
      (request) =>
        request.method() === 'POST' && /\/api\/journalpost\/[^/]+\/journalforing$/.test(new URL(request.url()).pathname)
    )
    const journalføring = ventPåJournalføring(page)
    await page.getByRole('button', { name: 'Journalfør og koble til sak' }).click()
    const request = await journalføringRequest
    expect(request.postDataJSON()).toMatchObject({
      brukerFnr,
      avsenderFnr: nyAvsenderFnr,
      sak: { sakstype: 'FAGSAK', fagsakId: '9901', fagsaksystem: 'HOTSAK' },
    })
    const respons = await journalføring
    const { oppgaver } = await respons.json()
    const oppgaveId = oppgaver.find((oppgave: { isÅpen: boolean }) => oppgave.isÅpen)?.oppgaveId

    const modal = page.getByRole('dialog', { name: 'Dokumentene ble knyttet til eksisterende sak' })
    await expect(modal).toBeVisible()
    await expect(modal).toContainText('Dokumentene ble journalført og knyttet til en eksisterende sak i Hotsak.')
    await expect(modal.getByRole('button', { name: 'Gå til saken' })).toBeVisible()
    await modal.getByRole('button', { name: 'Gå til saken' }).click()

    await expect(page).toHaveURL(`/oppgave/${oppgaveId}`)
  })

  for (const { navn, radio, sak } of [
    { navn: 'Generell sak', radio: 'Velg Generell sak', sak: { sakstype: 'GENERELL_SAK' } },
    {
      navn: 'ekstern fagsak',
      radio: /Velg sak 1234A01:/,
      sak: { sakstype: 'FAGSAK', fagsakId: '1234A01', fagsaksystem: 'IT01' },
    },
  ]) {
    test(`viser ikke «Gå til saken» etter journalføring og kobling til ${navn}`, async ({ page }) => {
      await åpneJournalføringsoppgave(page)
      await page.getByRole('radio', { name: /^Koble til sak \(\d+\)$/ }).click()
      await page.getByRole('radio', { name: radio }).check()

      const journalføring = ventPåJournalføring(page)
      await page.getByRole('button', { name: 'Journalfør og koble til sak' }).click()
      const respons = await journalføring
      expect(respons.ok()).toBe(true)
      expect(respons.request().postDataJSON()).toMatchObject({ sak })

      const modal = page.getByRole('dialog', { name: 'Dokumentene ble knyttet til eksisterende sak' })
      await expect(modal).toBeVisible()
      await expect(modal).toContainText('Saken kan behandles videre i Gosys.')
      await expect(modal.getByRole('button', { name: 'Gå til saken' })).toHaveCount(0)
      await expect(modal.getByRole('button', { name: 'Behandle saken' })).toHaveCount(0)
    })
  }

  test('kan journalføre og opprette en ny Hotsak-sak og navigere til saken', async ({ page }) => {
    await åpneJournalføringsoppgave(page)
    const { avsenderFnr } = await hentParter(page)
    const annetFnr = avsenderFnr
    await page.getByRole('button', { name: 'Endre bruker' }).click()
    await page.getByRole('textbox', { name: 'Fødselsnummer' }).fill(annetFnr)
    await page.getByRole('button', { name: 'Velg', exact: true }).click()
    await expect(page.getByRole('textbox', { name: 'Fødselsnummer' })).toBeHidden()
    await expect(page.getByText(`Fnr: ${annetFnr.slice(0, 6)} ${annetFnr.slice(6)}`)).toBeVisible()
    await velgGjelder(page)
    await page.getByRole('combobox', { name: 'Legg i mappe (frivillig)' }).selectOption('663')

    const journalføringRequest = page.waitForRequest(
      (request) =>
        request.method() === 'POST' && /\/api\/journalpost\/[^/]+\/journalforing$/.test(new URL(request.url()).pathname)
    )
    const journalføring = ventPåJournalføring(page)
    await page.getByRole('button', { name: 'Journalfør og opprett sak' }).click()
    const request = await journalføringRequest
    expect(request.postDataJSON()).toMatchObject({
      brukerFnr: annetFnr,
      avsenderFnr,
      saksgrunnlag: { mappeId: '663' },
    })
    const respons = await journalføring
    const { oppgaver } = await respons.json()
    const oppgaveId = oppgaver.find((oppgave: { isÅpen: boolean }) => oppgave.isÅpen)?.oppgaveId

    const modal = page.getByRole('dialog', { name: 'Journalføringen er fullført og ny sak er opprettet' })
    await expect(modal).toBeVisible()
    const tilSaken = modal.getByRole('button', { name: 'Gå til saken' })
    await expect(tilSaken).toBeEnabled()
    await tilSaken.click()

    await expect(page).toHaveURL(`/oppgave/${oppgaveId}`)
  })
})

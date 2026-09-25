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

test.describe('Journalføring', () => {
  test('kan koble en journalpost til en eksisterende Hotsak-sak og navigere til saken', async ({ page }) => {
    await åpneJournalføringsoppgave(page)
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
      sak: { sakstype: 'FAGSAK', fagsakId: '9901', fagsaksystem: 'HOTSAK' },
    })
    const respons = await journalføring
    const { oppgaver } = await respons.json()
    const oppgaveId = oppgaver.find((oppgave: { isÅpen: boolean }) => oppgave.isÅpen)?.oppgaveId

    const modal = page.getByRole('dialog', { name: 'Dokumentene ble knyttet til eksisterende sak' })
    await expect(modal).toBeVisible()
    await expect(modal).toContainText('Dokumentene ble journalført og knyttet til en eksisterende sak i Hotsak.')
    await modal.getByRole('button', { name: 'Gå til saken' }).click()

    await expect(page).toHaveURL(`/oppgave/${oppgaveId}`)
  })

  test('kan journalføre og opprette en ny Hotsak-sak og navigere til saken', async ({ page }) => {
    await åpneJournalføringsoppgave(page)
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

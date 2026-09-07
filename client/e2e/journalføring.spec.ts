import { expect, test } from '@playwright/test'

import { åpneJournalføringsoppgave } from './helpers'

function ventPåJournalføring(page: import('@playwright/test').Page) {
  return page.waitForResponse((response) => {
    const path = new URL(response.url()).pathname
    return response.request().method() === 'POST' && /\/api\/journalpost\/[^/]+\/journalforing$/.test(path)
  })
}

test.describe('Journalføring', () => {
  test('kan koble en journalpost til en eksisterende Hotsak-sak og navigere til saken', async ({ page }) => {
    await åpneJournalføringsoppgave(page)

    const kobleTilSak = page.getByRole('radio', { name: /^Koble til sak \(\d+\)$/ })
    await expect(kobleTilSak).toBeVisible()
    await kobleTilSak.click()
    await page.getByRole('radio', { name: /Velg sak 9901:/ }).check()

    const journalføring = ventPåJournalføring(page)
    await page.getByRole('button', { name: 'Journalfør og knytt til sak' }).click()
    const respons = await journalføring
    const { sakId, oppgaver } = await respons.json()
    const oppgaveId = oppgaver.find((oppgave: { isÅpen: boolean }) => oppgave.isÅpen)?.oppgaveId

    const modal = page.getByRole('dialog', { name: 'Journalpost ferdig journalført' })
    await expect(modal).toBeVisible()
    await expect(modal).toContainText(`Journalposten ble koblet til sak ${sakId}.`)
    await modal.getByRole('button', { name: 'Til saken' }).click()

    await expect(page).toHaveURL(`/oppgave/${oppgaveId}`)
  })

  test('kan journalføre og opprette en ny Hotsak-sak og navigere til saken', async ({ page }) => {
    await åpneJournalføringsoppgave(page)

    await page.getByRole('combobox', { name: 'Gjelder' }).fill('ganghjelpemiddel')
    await page
      .getByRole('option', { name: /Ganghjelpemiddel/i })
      .first()
      .click()

    const journalføring = ventPåJournalføring(page)
    await page.getByRole('button', { name: 'Journalfør og opprett sak' }).click()
    const respons = await journalføring
    const { sakId, oppgaver } = await respons.json()
    const oppgaveId = oppgaver.find((oppgave: { isÅpen: boolean }) => oppgave.isÅpen)?.oppgaveId

    const modal = page.getByRole('dialog', { name: 'Journalpost ferdig journalført' })
    await expect(modal).toBeVisible()
    await expect(modal).toContainText(`Sak med sakId ${sakId} ble opprettet.`)
    const tilSaken = modal.getByRole('button', { name: 'Til saken' })
    await expect(tilSaken).toBeEnabled()
    await tilSaken.click()

    await expect(page).toHaveURL(`/oppgave/${oppgaveId}`)
  })
})

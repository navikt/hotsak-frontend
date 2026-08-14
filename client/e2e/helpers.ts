import { type Page } from '@playwright/test'

/**
 * Navigate to the oppgaveliste and pick the first available oppgave of the given type.
 */
export async function plukkOppgave(page: Page, oppgavetype?: 'Journalføring' | 'Behandle sak') {
  await page.goto('/')
  // Navigate to "Enhetens oppgaver" to see unassigned oppgaver with "Ta oppgaven" button
  await page.getByRole('link', { name: /Enhetens oppgaver/i }).click()
  await page.getByRole('table').waitFor({ state: 'visible' })

  if (oppgavetype) {
    // Find a row with matching oppgavetype and click its "Ta oppgaven" button
    const row = page.getByRole('row').filter({ hasText: oppgavetype }).first()
    await row.getByRole('button', { name: /Ta oppgaven/i }).click()
  } else {
    await page
      .getByRole('button', { name: /Ta oppgaven/i })
      .first()
      .click()
  }
}

/**
 * Wait for the SakV2 behandlingspanel to be visible.
 */
export async function ventPåSaksbilde(page: Page) {
  await page.getByRole('combobox', { name: /resultat/i }).waitFor({ state: 'visible', timeout: 15_000 })
}

/**
 * Set the behandlingsresultat (vedtaksresultat) in SakV2.
 */
export async function settBehandlingsresultat(page: Page, resultat: 'Innvilget' | 'Delvis innvilget' | 'Avslått') {
  const lagret = page.waitForResponse((r) => {
    const path = new URL(r.url()).pathname
    return (
      (r.request().method() === 'PUT' && /\/behandling\/\d+$/.test(path)) ||
      (r.request().method() === 'POST' && /\/behandling$/.test(path))
    )
  })
  await page.getByRole('combobox', { name: /resultat/i }).selectOption(resultat)
  await lagret
}

/**
 * Click "Fatt vedtak" button in the sticky bottom bar.
 */
export async function klikkFattVedtak(page: Page) {
  await page.getByRole('button', { name: /Fatt vedtak/i }).click()
}

/**
 * Click the "Godkjenn begrunnelse" button.
 */
export async function klikkGodkjennBegrunnelse(page: Page) {
  await page.getByRole('button', { name: /Godkjenn begrunnelse/i }).click()
}

/**
 * Fill out the begrunnelse form.
 */
export async function fyllUtBegrunnelse(page: Page) {
  await page.getByRole('textbox', { name: /Begrunnelse/i }).fill('POST Dette er en begrunnelse.')
}

/**
 * Click the "Godkjenn begrunnelse" button.
 */
export async function klikkGodkjennBeskjed(page: Page) {
  await page.getByRole('button', { name: /Godkjenn beskjed/i }).click()
}

/**
 * Create a vedtaksbrev by clicking "Opprett vedtaksbrev".
 */
export async function opprettVedtaksbrev(page: Page) {
  await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()
}

/**
 * Ferdigstill the brevutkast in the brev panel.
 */
export async function ferdigstillBrevutkast(page: Page) {
  await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()
}

export async function fyllPlaceholder(page: Page, placeholderNavn: RegExp, tekst: string) {
  await page.getByRole('link', { name: placeholderNavn }).first().click()
  await page.waitForTimeout(150)
  await page.keyboard.type(tekst)
  await page.getByText('Lagret').waitFor({ state: 'visible' })
  await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()
}

/**
 * Pick an oppgave, open it, and wait for the SakV2 behandlingspanel to load.
 */
export async function åpneSak(page: Page) {
  await plukkOppgave(page, 'Behandle sak')
  await page.getByRole('button', { name: /Åpne/i }).first().click()
  await ventPåSaksbilde(page)
}

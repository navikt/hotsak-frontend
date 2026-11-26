import { type Page, test } from '@playwright/test'

// Tar skjermbilder til produktsiden med syntetiske testdata fra MSW.
// Kjør med `pnpm run produktside:skjermbilder`. Bildene lagres i product-site/assets/.

const assets = '../product-site/assets'

const skjulUtviklerverktøy = `
  div:has(> [data-testid="utviklerverktoy-lukk"]),
  .unleash-toolbar-container { display: none !important; }
`

type Utsnitt = { x: number; y: number; width: number; height: number }

async function taBilde(page: Page, navn: string, clip?: Utsnitt) {
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur())
  await page.waitForTimeout(1000)
  await page.screenshot({ path: `${assets}/${navn}.png`, style: skjulUtviklerverktøy, clip })
}

async function åpneOppgaveSomMatcher(page: Page, tekst: string | RegExp) {
  await page.goto('/oppgaver/enhetens')
  await page.getByRole('table').waitFor()
  const rad = page.getByRole('row').filter({ hasText: tekst }).first()
  await rad.getByRole('button', { name: /Ta oppgaven/i }).click()
  await rad.getByRole('button', { name: /Åpne/i }).click()
}

test('oppgaveliste', async ({ page }) => {
  await page.goto('/oppgaver/enhetens')
  await page.getByRole('table').waitFor()
  await taBilde(page, 'oppgaveliste')
})

test('saksbilde', async ({ page }) => {
  await åpneOppgaveSomMatcher(page, 'Terskeleliminator')
  await page.getByRole('combobox', { name: /resultat/i }).waitFor()
  await taBilde(page, 'saksbilde')
})

test('personoversikt', async ({ page }) => {
  await page.goto('/oppgaver/enhetens')
  await page.getByRole('searchbox').fill('01010199999')
  await page.keyboard.press('Enter')
  await page.getByRole('tab', { name: /Utlånsoversikt/ }).click()
  await page.getByRole('table').waitFor()
  await taBilde(page, 'personoversikt', { x: 0, y: 0, width: 1440, height: 560 })
})

test('briller', async ({ page }) => {
  await åpneOppgaveSomMatcher(page, 'Briller til barn')
  await page.getByText('Brillens bestillingsdato').waitFor()
  await taBilde(page, 'barnebriller', { x: 0, y: 48, width: 420, height: 760 })
})

test('journalføring', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1300 })
  await åpneOppgaveSomMatcher(page, /Journalføring.*Hjelpemidler|Hjelpemidler.*Journalføring/)
  await page.getByRole('heading', { level: 1, name: 'Journalføring' }).waitFor()
  await page
    .getByRole('radiogroup', { name: /Kan du bekrefte at dokumentene ligger på riktig bruker/ })
    .getByRole('radio', { name: 'Ja' })
    .check()
  await page.getByText(/Foreslått fordi du bekreftet/).waitFor()
  const dokumenter = await page.getByRole('heading', { name: 'Dokumenter' }).boundingBox()
  await taBilde(page, 'journalforing-innsyn', { x: 0, y: dokumenter!.y - 16, width: 570, height: 345 })

  await page
    .getByRole('radiogroup', { name: /Kan du bekrefte at dokumentene ligger på riktig bruker/ })
    .getByRole('radio', { name: /Nei/ })
    .check()
  await page.getByRole('radio', { name: /Overføring av hjelpemiddel/ }).check()
  await page.getByText(/Foreslått fordi du bekreftet at dokumentene gjelder overføring/).waitFor()
  await taBilde(page, 'journalforing-innsyn-overforing', { x: 0, y: dokumenter!.y - 16, width: 570, height: 490 })
})

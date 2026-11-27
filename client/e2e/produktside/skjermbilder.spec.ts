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

async function utsnittMellom(page: Page, øverst: string | RegExp, nederst: string | RegExp, x = 0, width = 570) {
  const topp = await page.getByText(øverst).first().boundingBox()
  const bunn = await page.getByText(nederst).first().boundingBox()
  const y = topp!.y - 16
  return { x, y, width, height: bunn!.y + bunn!.height + 16 - y }
}

test('journalføring svartidsbrev', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1600 })
  await åpneOppgaveSomMatcher(page, /Journalføring.*Hjelpemidler|Hjelpemidler.*Journalføring/)
  await page.getByRole('heading', { level: 1, name: 'Journalføring' }).waitFor()
  await page.getByRole('checkbox', { name: 'Ja, opprett brev' }).check()
  await page.getByRole('combobox', { name: 'Forventet behandlingstid' }).selectOption({ label: '8 uker' })
  await page
    .getByRole('textbox', { name: /Forklar hvorfor saken ikke kan behandles/ })
    .fill('Vi har mange saker til behandling, og det tar derfor lengre tid enn vanlig.')
  await page.getByRole('checkbox', { name: 'Ja, opprett brev' }).scrollIntoViewIfNeeded()
  const utsnitt = await utsnittMellom(
    page,
    'Vil du sende brev om forventet saksbehandlingstid til bruker?',
    'Brevet legges til utsending når du journalfører saken.'
  )
  await taBilde(page, 'journalforing-svartidsbrev', utsnitt)
})

async function åpneVedtaksbrev(page: Page) {
  await page.setViewportSize({ width: 1440, height: 1500 })
  await åpneOppgaveSomMatcher(page, 'Terskeleliminator')
  const resultat = page.getByRole('combobox', { name: /resultat/i })
  await resultat.waitFor()
  await resultat.selectOption('Innvilget')
  await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()
  await page.getByRole('tab', { name: 'Vedtaksbrev', exact: true }).waitFor()
}

async function brevpanelUtsnitt(page: Page, nederstKnapp: string) {
  const panel = await page.getByTestId('brevpanel').boundingBox()
  const knapp = await page.getByRole('button', { name: nederstKnapp }).boundingBox()
  return { x: panel!.x, y: panel!.y, width: panel!.width, height: knapp!.y + knapp!.height + 16 - panel!.y }
}

test('brev nytt utkast', async ({ page }) => {
  await åpneVedtaksbrev(page)
  await page.getByRole('tab', { name: 'Nytt utkast' }).click()
  await page.getByRole('radio', { name: /Svartidsbrev/ }).check()
  await page.getByRole('button', { name: 'Opprett utkast' }).waitFor()
  await taBilde(page, 'brev-nytt-utkast', await brevpanelUtsnitt(page, 'Opprett utkast'))
})

test('brev innstillinger', async ({ page }) => {
  await åpneVedtaksbrev(page)
  await page.getByRole('button', { name: 'Innstillinger' }).click()
  await page.getByRole('checkbox', { name: /Del kopi med formidler/ }).check()
  await page.getByRole('textbox', { name: 'Adresselinje 1' }).waitFor()
  await taBilde(page, 'brev-innstillinger', await brevpanelUtsnitt(page, 'Lagre mottaker'))
})

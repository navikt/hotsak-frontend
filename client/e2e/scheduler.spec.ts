import { expect, test } from '@playwright/test'

test('kan navigere til planlagte jobber, se historikk og planlegge kjøring', async ({ page }) => {
  let antallKjøringer = 0
  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('/db-scheduler/api/jobs/oppdater-oppgaver/run')) {
      antallKjøringer += 1
    }
  })

  await page.goto('/')
  await page.getByRole('button', { name: 'Systemer og oppslagsverk' }).click()
  await page.getByRole('menuitem', { name: 'Planlagte jobber' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Planlagte jobber' })).toBeVisible()

  const oversikt = page.getByRole('table', { name: 'Oversikt over planlagte jobber' })
  const ventendeRad = oversikt.getByRole('row').filter({ hasText: 'oppdater-oppgaver' })
  const kjørendeRad = oversikt.getByRole('row').filter({ hasText: 'synkroniser-brukere' })
  const ikkePlanlagtRad = oversikt.getByRole('row').filter({ hasText: 'oppfrisk-hurtigbuffer' })
  await expect(ventendeRad).toContainText('Venter')
  await expect(kjørendeRad).toContainText('Kjører')
  await expect(ikkePlanlagtRad).toContainText('Ikke planlagt')
  await expect(kjørendeRad.getByRole('button', { name: 'Kjør synkroniser-brukere nå' })).toBeDisabled()
  await expect(ikkePlanlagtRad.getByRole('button', { name: 'Kjør oppfrisk-hurtigbuffer nå' })).toBeDisabled()

  await ventendeRad.getByRole('button', { name: 'Vis historikk for oppdater-oppgaver' }).click()
  await expect(page.getByText('hotsak-api-lokal')).toBeVisible()
  await expect(page.getByText(/Pod startet:/)).toBeVisible()

  await ventendeRad.getByRole('button', { name: 'Kjør oppdater-oppgaver nå' }).click()
  const dialog = page.getByRole('alertdialog', { name: 'Bekreft kjøring av jobb' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Avbryt' }).click()
  await expect(dialog).not.toBeVisible()
  expect(antallKjøringer).toBe(0)

  await ventendeRad.getByRole('button', { name: 'Kjør oppdater-oppgaver nå' }).click()
  const kjøringSvar = page.waitForResponse(
    (response) =>
      response.request().method() === 'POST' && response.url().includes('/db-scheduler/api/jobs/oppdater-oppgaver/run')
  )
  await dialog.getByRole('button', { name: 'Kjør nå' }).click()
  expect((await kjøringSvar).status()).toBe(204)
  await expect(page.getByText('Jobben er planlagt for kjøring nå', { exact: true })).toBeVisible()
  expect(antallKjøringer).toBe(1)
})

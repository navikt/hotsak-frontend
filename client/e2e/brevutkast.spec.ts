import { expect, type Page, test } from '@playwright/test'

import { type FinnOppgaverResponse } from '../src/oppgave/oppgaveTypes'
import { fyllPlaceholder, klikkFattVedtak, opprettVedtaksbrev, settBehandlingsresultat, åpneSak } from './helpers'

async function åpneRedigerbartUtkast(page: Page) {
  await page.goto('/oppgaver/mine')
  await page.getByRole('table').waitFor({ state: 'visible' })
  const { oppgaver }: FinnOppgaverResponse = await page.evaluate(async () => {
    const response = await fetch('/api/oppgaver/sok', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statuskategori: 'ÅPEN', oppgavetype: ['BEHANDLE_SAK'], pageSize: 1000 }),
    })
    if (!response.ok) throw new Error('Kunne ikke hente testoppgaver')
    return response.json()
  })
  const søknadsoppgave = oppgaver.find((oppgave) => oppgave.sak?.sakstype === 'SØKNAD')
  expect(søknadsoppgave, 'Testen trenger en åpen søknadsoppgave').toBeDefined()
  await page.evaluate(async (oppgaveId) => {
    const response = await fetch(`/api/oppgaver/${oppgaveId}/tildeling`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    if (!response.ok) throw new Error('Kunne ikke tildele testoppgaven')
  }, søknadsoppgave!.oppgaveId)
  await page.goto(`/oppgave/${søknadsoppgave!.oppgaveId}`)
  await page.getByRole('combobox', { name: /resultat/i }).waitFor({ state: 'visible' })
  const vedtaksbrev = page.getByRole('tab', { name: 'Vedtaksbrev', exact: true })
  if (await vedtaksbrev.count()) {
    await vedtaksbrev.click()
  } else {
    await settBehandlingsresultat(page, 'Innvilget')
    await opprettVedtaksbrev(page)
  }
}

test.describe('Brevutkast', () => {
  test('lagrer siste endring før bytte til nytt utkast', async ({ page }) => {
    await åpneRedigerbartUtkast(page)
    const editor = page.getByRole('textbox', { name: 'Breveditor', exact: true })
    await expect(editor).toBeVisible()
    await page.clock.install()
    await page.clock.pauseAt(new Date(Date.now() + 1000))
    await editor.click()
    await editor.press('ControlOrMeta+End')
    await editor.press('Enter')
    await page.keyboard.insertText('Denne endringen skal bevares ved fanebytte.')
    const lagret = page.waitForResponse(
      (response) =>
        response.request().method() === 'PUT' &&
        response.url().includes('/brev/') &&
        (response.request().postData()?.includes('Denne endringen skal bevares ved fanebytte.') ?? false)
    )
    await page.getByRole('tab', { name: 'Nytt utkast' }).click()
    await page.clock.runFor(1000)
    expect((await lagret).ok()).toBe(true)
    await expect(page.getByRole('tab', { name: 'Nytt utkast' })).toHaveAttribute('aria-selected', 'true')
    await expect(editor).not.toBeVisible()
    await page.getByRole('tab', { name: 'Vedtaksbrev', exact: true }).click()
    await page.clock.runFor(1000)
    await expect(editor).toContainText('Denne endringen skal bevares ved fanebytte.')
  })

  test('beholder gjeldende fane og endringer når lagring feiler', async ({ page }) => {
    await åpneRedigerbartUtkast(page)
    const editor = page.getByRole('textbox', { name: 'Breveditor', exact: true })
    await expect(editor).toBeVisible()
    await page.clock.install()
    await page.clock.pauseAt(new Date(Date.now() + 1000))
    await page.evaluate(() => {
      const originalFetch = window.fetch.bind(window)
      window.fetch = async (input, options) => {
        if (options?.method === 'PUT' && String(input).includes('/brev/')) {
          window.fetch = originalFetch
          return new Response('Lagring feilet', { status: 503 })
        }
        return originalFetch(input, options)
      }
    })
    await editor.click()
    await editor.press('ControlOrMeta+End')
    await editor.press('Enter')
    await page.keyboard.insertText('Denne endringen må ikke gå tapt.')
    await page.getByRole('tab', { name: 'Nytt utkast' }).click()
    await expect(page.getByText('Kunne ikke lagre brevet. Prøv å bytte fane igjen.')).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Vedtaksbrev', exact: true })).toHaveAttribute('aria-selected', 'true')
    await expect(editor).toContainText('Denne endringen må ikke gå tapt.')
    await page.getByRole('tab', { name: 'Nytt utkast' }).click()
    await page.clock.runFor(1000)
    await expect(page.getByRole('tab', { name: 'Nytt utkast' })).toHaveAttribute('aria-selected', 'true')
  })

  test('kan opprette og ferdigstille et brevutkast', async ({ page }) => {
    test.slow()
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Innvilget')

    await page.getByRole('button', { name: /Opprett vedtaksbrev/i }).click()
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).click()
    await fyllPlaceholder(
      page,
      /Forklar hvilke opplysninger du har lagt vekt på når du har vurdert om vilkårene er oppfylt/i,
      'Vilkårene er vurdert som oppfylt basert på innsendt dokumentasjon.'
    )

    await expect(page.getByRole('button', { name: /^Rediger$/i })).toBeVisible()
    await expect(page.getByText(/Du har markert brevet som ferdigstilt/i)).toBeVisible()
  })

  test('kan slette et brevutkast', async ({ page }) => {
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Innvilget')
    await opprettVedtaksbrev(page)
    await page.getByRole('button', { name: /Slett utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })

    await page.getByRole('button', { name: /Slett utkast/i }).click()
    const slettModal = page.getByRole('dialog', { name: /Vil du slette brevutkastet/i })
    await expect(slettModal).toBeVisible()
    await slettModal.getByRole('button', { name: /Slett utkast/i }).click()
    await expect(slettModal).not.toBeVisible({ timeout: 10_000 })

    await expect(page.getByRole('button', { name: /Opprett vedtaksbrev/i })).toBeVisible()
  })

  test('kan ikke fatte vedtak med et brevutkast som ikke er ferdigstilt', async ({ page }) => {
    await åpneSak(page)

    await settBehandlingsresultat(page, 'Innvilget')
    await opprettVedtaksbrev(page)
    await page.getByRole('button', { name: /Ferdigstill utkast/i }).waitFor({ state: 'visible', timeout: 10_000 })

    await klikkFattVedtak(page)

    const brevManglerModal = page.getByRole('dialog', { name: /Mangler brev/i })
    await expect(brevManglerModal).toBeVisible()

    await brevManglerModal.getByRole('button', { name: /lukk/i }).click()
    await expect(brevManglerModal).not.toBeVisible()
  })

  test('viser "Mangler resultat" hvis man forsøker å fatte vedtak uten å ha valgt resultat', async ({ page }) => {
    await åpneSak(page)

    await klikkFattVedtak(page)

    const modal = page.getByRole('dialog', { name: /Mangler resultat/i })
    await expect(modal).toBeVisible()
    await expect(page.getByText(/Du må velge et vedtaksresultat/i)).toBeVisible()

    await modal.getByRole('button', { name: /lukk/i }).click()
    await expect(modal).not.toBeVisible()
  })
})

import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SWRConfig } from 'swr'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { type Journalføringsoppgave } from '../../oppgave/oppgaveTypes'
import { JournalføringSvartidsbrev } from '../JournalføringSvartidsbrev'

vi.mock('../../brev/breveditor/versjonerte-brev-stilark/v1.less?raw', async () => {
  const { readFileSync } = await import('node:fs')
  return {
    default: readFileSync('src/brev/breveditor/versjonerte-brev-stilark/v1.less', 'utf8'),
  }
})

function renderSkjema() {
  render(
    <SWRConfig value={{ provider: () => new Map() }}>
      <JournalføringSvartidsbrev
        oppgave={{ oppgaveId: 'oppgave-1' } as Journalføringsoppgave}
        mottattDato="2026-09-18"
      />
    </SWRConfig>
  )
}

describe('JournalføringSvartidsbrev', () => {
  afterEach(() => vi.restoreAllMocks())

  it('opens a local preview with the selected waiting time and can reopen after closing', async () => {
    const user = userEvent.setup()
    const fetch = vi.spyOn(globalThis, 'fetch')
    renderSkjema()

    await user.click(screen.getByRole('checkbox', { name: 'Ja, opprett brev' }))
    await user.selectOptions(screen.getByLabelText('Forventet behandlingstid'), '12')
    await user.type(
      screen.getByLabelText(/Forklar hvorfor saken ikke kan behandles i løpet av 1 måned/),
      'Vi mangler opplysninger fra kommunen.'
    )
    await user.click(screen.getByRole('button', { name: 'Forhåndsvis brev' }))

    await screen.findByRole('dialog', { name: 'Forhåndsvisning av svartidsbrev' })
    const ramme = (await screen.findByTitle('Forhåndsvisning av svartidsbrev')) as HTMLIFrameElement
    const dokument = new DOMParser().parseFromString(ramme.srcdoc, 'text/html')
    const hovedinnhold = dokument.querySelector('main')?.textContent
    expect(hovedinnhold).toContain('innen 12 uker')
    expect(hovedinnhold).toContain('18. september 2026')
    expect(hovedinnhold).toContain('Vi mangler opplysninger fra kommunen.')
    expect(hovedinnhold).not.toContain('auto_')
    expect(dokument.querySelector('h1')?.textContent).toContain('Vi trenger mer tid')
    expect(dokument.querySelector('header svg')).not.toBeNull()
    expect(dokument.querySelector('footer')?.textContent).toContain('Med vennlig hilsen')
    expect(dokument.querySelector('style')?.textContent).toContain('@page')
    expect(dokument.head.textContent).toContain('.header-row')
    expect(ramme.getAttribute('sandbox')).toBe('')
    expect(fetch).not.toHaveBeenCalled()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await user.click(screen.getByRole('button', { name: 'Forhåndsvis brev' }))
    expect(await screen.findByRole('dialog', { name: 'Forhåndsvisning av svartidsbrev' })).not.toBeNull()
  })

  it('previews the Nynorsk template with veker', async () => {
    const user = userEvent.setup()
    renderSkjema()

    await user.click(screen.getByRole('checkbox', { name: 'Ja, opprett brev' }))
    await user.click(screen.getByRole('radio', { name: 'Nynorsk' }))
    await user.type(
      screen.getByLabelText(/Forklar hvorfor saken ikke kan behandles i løpet/),
      'Vi ventar på svar frå kommunen.'
    )
    await user.click(screen.getByRole('button', { name: 'Forhåndsvis brev' }))

    const ramme = (await screen.findByTitle('Forhåndsvisning av svartidsbrev')) as HTMLIFrameElement
    const dokument = new DOMParser().parseFromString(ramme.srcdoc, 'text/html')
    const hovedinnhold = dokument.querySelector('main')?.textContent
    expect(dokument.querySelector('h1')?.textContent).toContain('Vi treng meir tid')
    expect(hovedinnhold).toContain('innan 4 veker')
    expect(hovedinnhold).toContain('Vi ventar på svar frå kommunen.')
    expect(hovedinnhold).not.toContain('auto_')
  })
})

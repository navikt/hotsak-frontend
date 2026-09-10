import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FormProvider, useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'
import { PunchHjelpemidler } from './PunchHjelpemidler.tsx'

const { useHjelpemiddelprodukterMock } = vi.hoisted(() => ({
  useHjelpemiddelprodukterMock: vi.fn(),
}))

vi.mock('../saksbilde/hjelpemidler/useHjelpemiddelprodukter.ts', () => ({
  useHjelpemiddelprodukter: useHjelpemiddelprodukterMock,
}))

function Skjema() {
  const form = useForm<JournalføringV2SkjemaVerdier>({
    defaultValues: { punchedeHjelpemidler: [] } as Partial<JournalføringV2SkjemaVerdier>,
  })
  return (
    <FormProvider {...form}>
      <PunchHjelpemidler kanRedigere />
    </FormProvider>
  )
}

function renderSkjema() {
  const bruker = userEvent.setup()
  render(<Skjema />)
  return { bruker }
}

async function slåOppHmsnumre(bruker: ReturnType<typeof userEvent.setup>, tekst: string) {
  await bruker.type(screen.getByRole('textbox', { name: /HMS-nummer \(skill med/ }), tekst)
  await bruker.click(screen.getByRole('button', { name: 'Slå opp' }))
}

describe('PunchHjelpemidler', () => {
  it('splitter HMS-numre på mellomrom og komma, og gir antall=1 som default', async () => {
    useHjelpemiddelprodukterMock.mockReturnValue({ data: [], isLoading: false })
    const { bruker } = renderSkjema()

    await slåOppHmsnumre(bruker, '111111, 222222 333333')

    const hmsnummerFelt = screen.getAllByRole('textbox', { name: 'HMS-nummer' })
    expect(hmsnummerFelt).toHaveLength(3)
    expect(hmsnummerFelt.map((felt) => (felt as HTMLInputElement).value)).toEqual(['111111', '222222', '333333'])

    const antallFelt = screen.getAllByRole('spinbutton', { name: 'Antall' })
    expect(antallFelt.map((felt) => (felt as HTMLInputElement).value)).toEqual(['1', '1', '1'])
  })

  it('dedupliserer like HMS-numre', async () => {
    useHjelpemiddelprodukterMock.mockReturnValue({ data: [], isLoading: false })
    const { bruker } = renderSkjema()

    await slåOppHmsnumre(bruker, '111111 111111,222222')

    expect(screen.getAllByRole('textbox', { name: 'HMS-nummer' })).toHaveLength(2)
  })

  it('viser produktnavn fra bulk-oppslag mot useHjelpemiddelprodukter', async () => {
    useHjelpemiddelprodukterMock.mockReturnValue({
      data: [{ hmsArtNr: '111111', artikkelnavn: 'Rullestol' }],
      isLoading: false,
    })
    const { bruker } = renderSkjema()

    await slåOppHmsnumre(bruker, '111111')

    expect(await screen.findByText('Rullestol')).toBeInTheDocument()
    expect(useHjelpemiddelprodukterMock).toHaveBeenLastCalledWith(['111111'])
  })

  it('viser «Fant ikke produkt» når oppslaget ikke gir treff', async () => {
    useHjelpemiddelprodukterMock.mockReturnValue({ data: [], isLoading: false })
    const { bruker } = renderSkjema()

    await slåOppHmsnumre(bruker, '999999')

    expect(await screen.findByText('Fant ikke produkt')).toBeInTheDocument()
  })

  it('kan fjerne en rad', async () => {
    useHjelpemiddelprodukterMock.mockReturnValue({ data: [], isLoading: false })
    const { bruker } = renderSkjema()

    await slåOppHmsnumre(bruker, '111111 222222')
    expect(screen.getAllByRole('textbox', { name: 'HMS-nummer' })).toHaveLength(2)

    await bruker.click(screen.getAllByRole('button', { name: 'Fjern hjelpemiddel' })[0])

    expect(screen.getAllByRole('textbox', { name: 'HMS-nummer' })).toHaveLength(1)
  })

  it('gjør ingenting ved tomt input', async () => {
    useHjelpemiddelprodukterMock.mockReturnValue({ data: [], isLoading: false })
    const { bruker } = renderSkjema()

    await bruker.click(screen.getByRole('button', { name: 'Slå opp' }))

    expect(screen.queryAllByRole('textbox', { name: 'HMS-nummer' })).toHaveLength(0)
  })
})

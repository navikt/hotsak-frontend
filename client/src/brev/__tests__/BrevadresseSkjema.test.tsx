import '@testing-library/jest-dom/vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { type Veiadresse } from '../../types/hotlibs.ts'
import { BrevadresseSkjema } from '../BrevadresseSkjema.tsx'

const adresse: Veiadresse = {
  adresselinje1: 'Testveien 1',
  postnummer: '0123',
  poststed: 'Oslo',
}

function renderSkjema(erEksisterendeMottaker: boolean, adresselinje2?: string) {
  const onLagre = vi.fn()
  render(
    <BrevadresseSkjema
      initiellAdresse={{ ...adresse, adresselinje2 }}
      formidlerNavn="Ola Nordmann"
      erEksisterendeMottaker={erEksisterendeMottaker}
      isLoading={false}
      onLagre={onLagre}
      onAvbryt={vi.fn()}
      digitalBehovsmelding={false}
    />
  )
  return onLagre
}

describe('BrevadresseSkjema', () => {
  it.each([undefined, ''])(
    'preserves an empty address line 2 (%s) when editing and saving unrelated changes',
    async (adresselinje2) => {
      const user = userEvent.setup()
      const onLagre = renderSkjema(true, adresselinje2)
      expect(screen.getByRole('textbox', { name: 'Adresselinje 2 (valgfri)' })).toHaveValue('')
      await user.clear(screen.getByRole('textbox', { name: 'Adresselinje 1' }))
      await user.type(screen.getByRole('textbox', { name: 'Adresselinje 1' }), 'Testveien 2')
      await user.click(screen.getByRole('button', { name: 'Lagre mottaker' }))
      expect(onLagre).toHaveBeenCalledWith(
        { ...adresse, adresselinje1: 'Testveien 2', adresselinje2: undefined, adresselinje3: undefined },
        'Ola Nordmann'
      )
    }
  )

  it.each([undefined, ''])('defaults address line 2 (%s) when creating with a prefilled address', (adresselinje2) => {
    renderSkjema(false, adresselinje2)
    expect(screen.getByRole('textbox', { name: 'Adresselinje 2 (valgfri)' })).toHaveValue('v/ Ola Nordmann')
  })

  it.each([true, false])(
    'preserves a supplied address line 2 when existing recipient is %s',
    (erEksisterendeMottaker) => {
      renderSkjema(erEksisterendeMottaker, 'Avdeling 2')
      expect(screen.getByRole('textbox', { name: 'Adresselinje 2 (valgfri)' })).toHaveValue('Avdeling 2')
    }
  )
})

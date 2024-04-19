import React from 'react'
import type { OverforGosysTilbakemelding } from '../types/types.internal'
import { Spørreundersøkelse } from '../innsikt/Spørreundersøkelse'
import type { IBesvarelse } from '../innsikt/Besvarelse'
import { OverførGosysModal } from './OverførGosysModal'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'

export interface OverførGosysModal2Props {
  open: boolean
  loading: boolean
  årsaker: ReadonlyArray<string>
  spørreundersøkelseId?: SpørreundersøkelseId
  legend?: string

  onBekreft(tilbakemelding: OverforGosysTilbakemelding | IBesvarelse): void | Promise<void>

  onClose(): void
}

export function OverførGosysModal2({
  open,
  loading,
  årsaker = ['Annet'],
  spørreundersøkelseId,
  legend = 'Hva må til for at du skulle kunne behandlet denne saken i Hotsak?',
  onBekreft,
  onClose,
}: OverførGosysModal2Props) {
  if (spørreundersøkelseId && window.appSettings.MILJO !== 'prod-gcp') {
    return (
      <Spørreundersøkelse
        open={open}
        loading={loading}
        spørreundersøkelseId={spørreundersøkelseId}
        size="small"
        knappetekst="Overfør til Gosys"
        onBesvar={onBekreft}
        onClose={onClose}
      />
    )
  }
  return (
    <OverførGosysModal
      open={open}
      loading={loading}
      årsaker={årsaker}
      legend={legend}
      onBekreft={onBekreft}
      onClose={onClose}
    />
  )
}

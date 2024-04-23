import React from 'react'
import { Spørreundersøkelse } from '../innsikt/Spørreundersøkelse'
import type { IBesvarelse } from '../innsikt/Besvarelse'
import type { ISpørreundersøkelse, SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'

export interface OverførGosysModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId

  onBekreft(besvarelse: IBesvarelse, spørreundersøkelse: ISpørreundersøkelse): void | Promise<void>
  onClose(): void
}

export function OverførGosysModal({ open, loading, spørreundersøkelseId, onBekreft, onClose }: OverførGosysModalProps) {
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

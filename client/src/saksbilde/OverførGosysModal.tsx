import React from 'react'
import { Spørreundersøkelse } from '../innsikt/Spørreundersøkelse'
import type { IBesvarelse, ISvar } from '../innsikt/Besvarelse'
import type { ISpørreundersøkelse, SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'

export interface OverførGosysModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId

  onBekreft(spørreundersøkelse: ISpørreundersøkelse, besvarelse: IBesvarelse, svar: ISvar[]): void | Promise<void>
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

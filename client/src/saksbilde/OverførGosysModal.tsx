import type { Tilbakemelding } from '../innsikt/Besvarelse'
import { SpørreundersøkelseModal } from '../innsikt/SpørreundersøkelseModal'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'

export interface OverførGosysModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId

  onBekreft(tilbakemelding: Tilbakemelding): void | Promise<void>
  onClose(): void
}

export function OverførGosysModal({ open, loading, spørreundersøkelseId, onBekreft, onClose }: OverførGosysModalProps) {
  return (
    <SpørreundersøkelseModal
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

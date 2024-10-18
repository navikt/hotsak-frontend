import type { Tilbakemelding } from '../innsikt/Besvarelse'
import { SpørreundersøkelseModal } from '../innsikt/SpørreundersøkelseModal.tsx'
import type { SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'

export interface InformasjonOmHjelpemiddelModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId
  onBesvar(tilbakemelding: Tilbakemelding): void | Promise<void>
  error: string | undefined
  onClose(): void
}

export function InformasjonOmHjelpemiddelModal({
  open,
  loading,
  spørreundersøkelseId,
  onBesvar,
  onClose,
  error,
}: InformasjonOmHjelpemiddelModalProps) {
  return (
    <SpørreundersøkelseModal
      open={open}
      loading={loading}
      spørreundersøkelseId={spørreundersøkelseId}
      size="small"
      knappetekst="Send"
      onBesvar={onBesvar}
      onClose={onClose}
      error={error}
    />
  )
}

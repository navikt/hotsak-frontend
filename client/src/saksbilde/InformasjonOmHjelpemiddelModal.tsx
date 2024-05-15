import type { IBesvarelse, ISvar } from '../innsikt/Besvarelse'
import { Spørreundersøkelse } from '../innsikt/Spørreundersøkelse'
import type { ISpørreundersøkelse, SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'

export interface InformasjonOmHjelpemiddelModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId
  onBesvar(spørreundersøkelse: ISpørreundersøkelse, besvarelse: IBesvarelse, svar: ISvar[]): void | Promise<void>
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
    <Spørreundersøkelse
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

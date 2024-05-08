import type { IBesvarelse, ISvar } from '../innsikt/Besvarelse'
import { Spørreundersøkelse } from '../innsikt/Spørreundersøkelse'
import type { ISpørreundersøkelse, SpørreundersøkelseId } from '../innsikt/spørreundersøkelser'

export interface SavnerInformasjonOmHjelpemiddelModalProps {
  open: boolean
  loading: boolean
  spørreundersøkelseId: SpørreundersøkelseId
  onBesvar(spørreundersøkelse: ISpørreundersøkelse, besvarelse: IBesvarelse, svar: ISvar[]): void | Promise<void>
  onClose(): void
}

export function SavnerInformasjonOmHjelpemiddelModal({
  open,
  loading,
  spørreundersøkelseId,
  onBesvar,
  onClose,
}: SavnerInformasjonOmHjelpemiddelModalProps) {
  return (
    <Spørreundersøkelse
      open={open}
      loading={loading}
      spørreundersøkelseId={spørreundersøkelseId}
      size="small"
      knappetekst="Send"
      onBesvar={onBesvar}
      onClose={onClose}
    />
  )
}

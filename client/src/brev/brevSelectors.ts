import { type Predicate } from '../utils/predicate'
import { type Brev, Brevmal, Brevstatus } from './brevTyper'

export function isBrevmal(brevmal: Brevmal): Predicate<Brev> {
  return (brev) => brev.brevmal === brevmal
}

export function isBrevmalOneOf(...brevmaler: Brevmal[]): Predicate<Brev> {
  return (brev) => brevmaler.some((brevmal) => brev.brevmal === brevmal)
}

export function isBrevstatus(brevstatus: Brevstatus): Predicate<Brev> {
  return (brev) => brev.status === brevstatus
}

export const isBrevstatusUtkast: Predicate<Brev> = isBrevstatus(Brevstatus.UTKAST)
export const isBrevstatusFerdigstilt: Predicate<Brev> = isBrevstatus(Brevstatus.FERDIGSTILT)
export const isBrevstatusDistribuert: Predicate<Brev> = isBrevstatus(Brevstatus.DISTRIBUERT)

export const isBrevmalBarnebrillerVedtak: Predicate<Brev> = isBrevmalOneOf(
  Brevmal.BARNEBRILLER_VEDTAK_INNVILGELSE,
  Brevmal.BARNEBRILLER_VEDTAK_AVSLAG,
  Brevmal.BARNEBRILLER_VEDTAK_AVSLAG_MANGLENDE_OPPLYSNINGER
)

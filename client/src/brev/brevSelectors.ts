import { type Predicate } from '../utils/predicate'
import { type Brev, BreveditorbrevUtenVedtak, Brevmal, Brevstatus } from './brevTyper'

export function isBrevmal(brevmal: Brevmal): Predicate<Brev> {
  return (brev) => brev.brevmal === brevmal
}

export function isBrevmalOneOf(...brevmaler: Brevmal[]): Predicate<Brev> {
  return (brev) => brevmaler.some((brevmal) => brev.brevmal === brevmal)
}

export function isBrevstatus(brevstatus: Brevstatus): Predicate<Brev> {
  return (brev) => brev.brevstatus === brevstatus
}

export const isBrevstatusUtkast: Predicate<Brev> = isBrevstatus(Brevstatus.UTKAST)
export const isBrevstatusFerdigstilt: Predicate<Brev> = isBrevstatus(Brevstatus.FERDIGSTILT)
export const isBrevstatusDistribuert: Predicate<Brev> = isBrevstatus(Brevstatus.DISTRIBUERT)

export const isVedtaksbrev: Predicate<Brev> = isBrevmal(Brevmal.BREVEDITOR_VEDTAKSBREV)
export const isBreveditorbrev: Predicate<Brev> = isBrevmalOneOf(
  Brevmal.BREVEDITOR_VEDTAKSBREV,
  ...BreveditorbrevUtenVedtak
)

export const isBrevmalBarnebrillerVedtak: Predicate<Brev> = isBrevmalOneOf(
  Brevmal.BARNEBRILLER_VEDTAK_INNVILGELSE,
  Brevmal.BARNEBRILLER_VEDTAK_AVSLAG,
  Brevmal.BARNEBRILLER_VEDTAK_AVSLAG_MANGLENDE_OPPLYSNINGER
)

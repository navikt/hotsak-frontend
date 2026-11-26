import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { useSak } from '../saksbilde/useSak.ts'
import { Mottakertype } from './brevTyper.ts'
import { useBrevmottakerActions, useBrevmottakere } from './useBrev.ts'

/**
 * Backend legger til og fjerner verger sammen med bruker
 * Frontend sender derfor bare 1 kall for bruker.
 */
export function useBrukerSomMottaker(brevId?: string) {
  const { sak } = useSak()
  const brukerFnr = sak?.data.bruker.fnr
  const { data, error, isValidating } = useBrevmottakere(brevId)
  const { leggTilBrevmottaker, slettBrevmottaker } = useBrevmottakerActions(brevId)
  const { showErrorToast } = useToast()
  const brukerMottaker = data?.brevmottakere.find((mottaker) => mottaker.mottakertype === Mottakertype.BRUKER)
  const valgt = !!brukerMottaker
  const lagrer = leggTilBrevmottaker.isMutating || slettBrevmottaker.isMutating

  const kanSende = !!data && !error && !lagrer && !isValidating

  async function velgBruker(skalMotta: boolean) {
    if (lagrer) return
    if (!brevId || !data) return showErrorToast('Kunne ikke oppdatere mottakerne. Prøv igjen.')

    try {
      if (skalMotta) {
        if (valgt) return
        if (!brukerFnr) return showErrorToast('Kunne ikke oppdatere mottakerne. Prøv igjen.')
        await leggTilBrevmottaker.trigger({ mottakertype: Mottakertype.BRUKER, fnr: brukerFnr })
      } else if (brukerMottaker) {
        await slettBrevmottaker.trigger(brukerMottaker.id)
      }
    } catch {
      showErrorToast('Kunne ikke oppdatere mottakerne. Prøv igjen.')
    }
  }

  return {
    valgt,
    lagrer,
    kanEndre: kanSende && (valgt || !!brukerFnr),
    kanSende,
    velgBruker,
  }
}

export type BrukerSomMottaker = ReturnType<typeof useBrukerSomMottaker>

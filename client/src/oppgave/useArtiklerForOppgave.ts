import { type ArtikkellinjeSak } from '../sak/sakTypes.ts'
import { useArtiklerForSak } from '../sak/useArtiklerForSak.ts'
import { useHjelpemiddelprodukter } from '../saksbilde/hjelpemidler/useHjelpemiddelprodukter.ts'
import { type Delkontrakt } from '../types/types.internal.ts'
import { associateBy } from '../utils/array.ts'

export interface ArtikkellinjeOppgave extends ArtikkellinjeSak {
  url?: string
  delkontrakter: Delkontrakt[]
}

export interface UseArtiklerForOppgaveResponse {
  artikler: ArtikkellinjeOppgave[]
  isLoading: boolean
  error?: Error
}

export function useArtiklerForOppgave(sakId?: Nullable<ID>): UseArtiklerForOppgaveResponse {
  const { artikler, isLoading: artiklerIsLoading, error: artiklerError } = useArtiklerForSak(sakId)
  const {
    data: produkter,
    isLoading: produkterIsLoading,
    error: produkterError,
  } = useHjelpemiddelprodukter(artikler.map((it) => it.hmsArtNr))
  const produkterByHmsArtNr = associateBy(produkter, (it) => it.hmsArtNr)
  return {
    artikler: artikler.map((it) => {
      const produkt = produkterByHmsArtNr[it.hmsArtNr]
      return {
        ...it,
        artikkelnavn: produkt?.artikkelnavn ?? it.artikkelnavn,
        url: produkt?.produktUrl,
        delkontrakter: produkt?.delkontrakter ?? [],
      }
    }),
    isLoading: artiklerIsLoading || produkterIsLoading,
    error: artiklerError || produkterError,
  }
}

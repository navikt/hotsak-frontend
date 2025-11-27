import { type ArtikkellinjeSak } from '../sak/sakTypes.ts'
import { useArtiklerForSak } from '../sak/useArtiklerForSak.ts'
import { useHjelpemiddelprodukter } from '../saksbilde/hjelpemidler/useHjelpemiddelprodukter.ts'
import { associateBy } from '../utils/array.ts'

export interface ArtikkellinjeOppgave extends ArtikkellinjeSak {
  url?: string
  delkontrakter: string[]
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
  const produkterByHmsArtNr = associateBy(produkter, (it) => it.hmsnr)
  return {
    artikler: artikler.map((it) => {
      const produkt = produkterByHmsArtNr[it.hmsArtNr]
      return {
        ...it,
        artikkelnavn: produkt?.artikkelnavn ?? it.artikkelnavn,
        url: produkt?.produkturl,
        delkontrakter: produkt?.posttitler ?? [],
      }
    }),
    isLoading: artiklerIsLoading || produkterIsLoading,
    error: artiklerError || produkterError,
  }
}

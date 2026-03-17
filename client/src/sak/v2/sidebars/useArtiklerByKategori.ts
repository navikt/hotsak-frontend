import { useMemo } from 'react'
import { HjelpemiddelArtikkel } from '../../../types/types.internal'

export function useArtiklerByKategori(artikler: HjelpemiddelArtikkel[]): [string, HjelpemiddelArtikkel[]][] {
  return useMemo(() => {
    const resultat = artikler.reduce<Record<string, HjelpemiddelArtikkel[]>>((grupper, artikkel) => {
      const { isoKategori, grunndataKategoriKortnavn } = artikkel
      const kategori = grunndataKategoriKortnavn || isoKategori
      if (!grupper[kategori]) {
        grupper[kategori] = []
      }
      grupper[kategori].push(artikkel)
      return grupper
    }, {})

    return Object.entries(resultat).sort(([a], [b]) => a.localeCompare(b))
  }, [artikler])
}

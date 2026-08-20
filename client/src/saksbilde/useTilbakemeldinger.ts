import useSwr from 'swr'

import { ISvar } from '../innsikt/Besvarelse'
import { HttpError } from '../io/HttpError'

const SAK_OVERFORT_GOSYS_SKJEMA = 'sak_overført_gosys_v1'

export interface TilbakemeldingerResponse {
  sakId: string
  skjema: string
  svar: ISvar
  opprettet: string
}

export interface GruppertTilbakemelding {
  spørsmål: string
  sti: string[]
  svar: string[]
}

export interface UseTilbakemeldingerResult {
  alleTilbakemeldinger: TilbakemeldingerResponse[]
  overførtGosysTilbakemeldinger: TilbakemeldingerResponse[]
  grupperteOverførtGosysTilbakemeldinger: GruppertTilbakemelding[]
  isLoading: boolean
  error?: HttpError
}

function grupperTilbakemeldinger(tilbakemeldinger: TilbakemeldingerResponse[]): GruppertTilbakemelding[] {
  const grupper = new Map<string, GruppertTilbakemelding>()

  tilbakemeldinger.forEach((tilbakemelding) => {
    const spørsmål = tilbakemelding.svar.spørsmål
    const sti = tilbakemelding.svar.sti
    const key = `${sti.join('>')}|${spørsmål}`
    const eksisterende = grupper.get(key)

    if (eksisterende) {
      eksisterende.svar.push(tilbakemelding.svar.svar)
    } else {
      grupper.set(key, {
        spørsmål,
        sti,
        svar: [tilbakemelding.svar.svar],
      })
    }
  })

  return Array.from(grupper.values())
}

export function useTilbakemeldinger(sakId?: string): UseTilbakemeldingerResult {
  const { data, isLoading, error } = useSwr<TilbakemeldingerResponse[], HttpError>(
    sakId ? `/api/sak/${sakId}/tilbakemelding` : null
  )
  const alleTilbakemeldinger = data ?? []
  const overførtGosysTilbakemeldinger = alleTilbakemeldinger.filter(
    (tilbakemelding) => tilbakemelding.skjema === SAK_OVERFORT_GOSYS_SKJEMA
  )

  return {
    alleTilbakemeldinger,
    overførtGosysTilbakemeldinger,
    grupperteOverførtGosysTilbakemeldinger: grupperTilbakemeldinger(overførtGosysTilbakemeldinger),
    isLoading,
    error,
  }
}

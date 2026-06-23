import { useForm, UseFormReturn } from 'react-hook-form'
import { useBehovsmelding } from '../../saksbilde/useBehovsmelding.ts'
import { useProblemsammendrag } from '../../saksbilde/venstremeny/useProblemsammendrag.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { Hjelpemiddel, OpplysningId } from '../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../types/types.internal.ts'
import { useArtiklerForSak } from './useArtiklerForSak.ts'

export interface VedtakFormValues {
  problemsammendrag: string
  postbegrunnelse?: string
  utleveringMerknad?: string
}

export interface UseVedtakReturn {
  form: UseFormReturn<VedtakFormValues>
  lavereRangertHjelpemiddel: Hjelpemiddel | undefined
  sammendragMedLavere: boolean
  lavereRangertBegrunnelse: string | undefined
  validerPostbegrunnelse: (value: string | undefined) => string | true
  harEndretPostbegrunnelse: () => boolean
  harEndretProblemsammendrag: () => boolean
  logTilUmami: () => void
}

export function useVedtak(sak: Sak) {
  const behovsmelding = useBehovsmelding()
  const artikler = useArtiklerForSak(sak.sakId)
  const { problemsammendrag, sammendragMedLavere } = useProblemsammendrag()
  const { logUtfallLavereRangert, logPostbegrunnelseEndret, logProblemsammendragEndret } = useUmami()
  const utleveringsmerknad = behovsmelding.behovsmelding?.levering.utleveringMerknad

  const lavereRangertHjelpemiddel = behovsmelding.behovsmelding?.hjelpemidler.hjelpemidler.find(
    (hjelpemiddel) => (hjelpemiddel.produkt.rangering ?? 0) > 1
  )

  const lavereRangerteHjelpemidler =
    behovsmelding.behovsmelding?.hjelpemidler.hjelpemidler.filter(
      (hjelpemiddel) => (hjelpemiddel.produkt.rangering ?? 0) > 1
    ) ?? []

  const lavereRangertBegrunnelse =
    lavereRangerteHjelpemidler
      .flatMap((hjelpemiddel) => {
        const harEndret = artikler.artikler.some(
          (artikkel) => artikkel.id === hjelpemiddel.hjelpemiddelId && artikkel.endretArtikkel
        )

        if (harEndret) {
          return []
        }

        const begrunnelseForLavereRangeringFritekstItem = hjelpemiddel.opplysninger
          .find((opplysning) => opplysning.key?.id === OpplysningId.LAVERE_RANGERING_BEGRUNNELSE)
          ?.innhold.at(0)?.fritekst

        return begrunnelseForLavereRangeringFritekstItem ? [`POST ${begrunnelseForLavereRangeringFritekstItem}`] : []
      })
      .join('\n\n') || undefined

  const form = useForm<VedtakFormValues>({
    values: {
      problemsammendrag: problemsammendrag,
      postbegrunnelse: lavereRangertBegrunnelse,
      utleveringMerknad: utleveringsmerknad,
    },
  })

  const harEndretPostbegrunnelse = () => {
    const currentValue = form.getValues('postbegrunnelse')
    return currentValue !== lavereRangertBegrunnelse
  }

  const harEndretProblemsammendrag = () => {
    const currentValue = form.getValues('problemsammendrag')
    return currentValue !== problemsammendrag
  }

  const logTilUmami = () => {
    if (lavereRangertHjelpemiddel) {
      logUtfallLavereRangert({ utfall: 'innvilget' })

      if (harEndretPostbegrunnelse()) {
        logPostbegrunnelseEndret()
      }

      if (harEndretProblemsammendrag()) {
        logProblemsammendragEndret({ originalt: problemsammendrag, nytt: form.getValues('problemsammendrag') })
      }
    }
  }

  return {
    form,
    lavereRangertHjelpemiddel,
    sammendragMedLavere,
    lavereRangertBegrunnelse,
    utleveringsmerknad,
    harEndretPostbegrunnelse,
    harEndretProblemsammendrag,
    logTilUmami,
  }
}

import { useForm, UseFormReturn } from 'react-hook-form'
import { Sak } from '../../types/types.internal.ts'
import { useBehovsmelding } from '../../saksbilde/useBehovsmelding.ts'
import { useArtiklerForSak } from './useArtiklerForSak.ts'
import { Hjelpemiddel, OpplysningId } from '../../types/BehovsmeldingTypes.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { useProblemsammendrag } from '../../saksbilde/venstremeny/useProblemsammendrag.ts'

export interface VedtakFormValues {
  problemsammendrag: string
  postbegrunnelse?: string
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
  const { problemsammendrag } = useProblemsammendrag()
  const { logUtfallLavereRangert, logPostbegrunnelseEndret, logProblemsammendragEndret } = useUmami()

  const lavereRangertHjelpemiddel = behovsmelding.behovsmelding?.hjelpemidler.hjelpemidler.find(
    (hjelpemiddel) => (hjelpemiddel.produkt.rangering ?? 0) > 1
  )

  const harEndretLavereRangertHjelpemiddel = artikler.artikler.some(
    (artikkel) => artikkel.id === lavereRangertHjelpemiddel?.hjelpemiddelId && artikkel.endretArtikkel
  )

  const begrunnelseForLavereRangeringFritekst = lavereRangertHjelpemiddel?.opplysninger
    .find((opplysning) => opplysning.key?.id === OpplysningId.LAVERE_RANGERING_BEGRUNNELSE)
    ?.innhold.at(0)?.fritekst

  const lavereRangertBegrunnelse =
    begrunnelseForLavereRangeringFritekst && !harEndretLavereRangertHjelpemiddel
      ? `POST ${begrunnelseForLavereRangeringFritekst}`
      : undefined

  const sammendragMedLavere = !!lavereRangertHjelpemiddel

  const form = useForm<VedtakFormValues>({
    values: {
      problemsammendrag: problemsammendrag,
      postbegrunnelse: lavereRangertBegrunnelse,
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
    harEndretPostbegrunnelse,
    harEndretProblemsammendrag,
    logTilUmami,
  }
}

import { useForm, UseFormReturn } from 'react-hook-form'
import { useBehovsmelding } from '../../saksbilde/useBehovsmelding.ts'
import { useServiceforespørsel } from '../../saksbilde/venstremeny/useProblemsammendrag.ts'
import { useUmami } from '../../sporing/useUmami.ts'
import { Hjelpemiddel } from '../../types/BehovsmeldingTypes.ts'

export interface VedtakFormValues {
  problemsammendrag: string
  postbegrunnelse?: string
  utleveringMerknad?: string
}

export interface UseVedtakReturn {
  form: UseFormReturn<VedtakFormValues>
  lavereRangertHjelpemiddel: Hjelpemiddel | undefined
  sammendragMedLavere: boolean
  originalePostbegrunnelser: string | undefined
  validerPostbegrunnelse: (value: string | undefined) => string | true
  harEndretPostbegrunnelse: () => boolean
  harEndretProblemsammendrag: () => boolean
  logTilUmami: () => void
}

export function useVedtak() {
  const behovsmelding = useBehovsmelding()
  const { problemsammendrag, sammendragMedLavere, postbegrunnelser } = useServiceforespørsel()
  const { logUtfallLavereRangert, logPostbegrunnelseEndret, logProblemsammendragEndret } = useUmami()
  const utleveringsmerknad = behovsmelding.behovsmelding?.levering.utleveringMerknad

  const lavereRangertHjelpemiddel = behovsmelding.behovsmelding?.hjelpemidler.hjelpemidler.find(
    (hjelpemiddel) => (hjelpemiddel.produkt.rangering ?? 0) > 1
  )

  const originalePostbegrunnelser = postbegrunnelser.join('\n\n')

  const form = useForm<VedtakFormValues>({
    values: {
      problemsammendrag: problemsammendrag,
      postbegrunnelse: originalePostbegrunnelser,
      utleveringMerknad: utleveringsmerknad,
    },
  })

  const harEndretPostbegrunnelse = () => {
    const currentValue = form.getValues('postbegrunnelse')
    return currentValue !== originalePostbegrunnelser
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
    originalePostbegrunnelser,
    utleveringsmerknad,
    harEndretPostbegrunnelse,
    harEndretProblemsammendrag,
    logTilUmami,
  }
}

import { memo } from 'react'
import { useSak } from '../../../../../saksbilde/useSak'
import { useBehovsmelding } from '../../../../../saksbilde/useBehovsmelding'
import { SakLoader } from '../../../../../saksbilde/SakLoader'
import { Sakstype } from '../../../../../types/types.internal'
import { SøknadCard } from '../../../../../saksbilde/venstremeny/SøknadCard'
import { FormidlerCard } from '../../../../../saksbilde/venstremeny/FormidlerCard'
import { LeveringCard } from '../../../../../saksbilde/venstremeny/LeveringCard'
import { formaterAdresse } from '../../../../../utils/formater'

export const SøknadsinfoEksperiment = memo(() => {
  const { sak, isLoading: isSakLoading } = useSak()
  const { behovsmelding, isLoading: isBehovsmeldingLoading } = useBehovsmelding()

  // TODO: Teste ut suspense mode i swr
  if (isSakLoading || isBehovsmeldingLoading) {
    return <SakLoader />
  }

  if (!sak || !behovsmelding) return <div>Fant ikke sak</div>

  const erBestilling = sak.data.sakstype === Sakstype.BESTILLING
  const levering = behovsmelding.levering
  const formidler = levering.hjelpemiddelformidler

  return (
    <>
      <SøknadCard
        sakId={sak.data.sakId}
        sakstype={sak.data.sakstype}
        søknadGjelder={sak.data.søknadGjelder}
        søknadMottatt={sak.data.opprettet}
        funksjonsnedsettelser={behovsmelding.brukersituasjon.funksjonsnedsettelser}
        telefon={sak?.data.bruker.telefon}
      />
      <FormidlerCard
        tittel={erBestilling ? 'Bestiller' : 'Formidler'}
        stilling={formidler.stilling}
        formidlerNavn={formidler.navn}
        formidlerTelefon={formidler.telefon}
        kommune={formidler.adresse.poststed}
      />
      <LeveringCard
        levering={behovsmelding.levering}
        adresseBruker={formaterAdresse(behovsmelding.bruker.veiadresse)}
      />
    </>
  )
})

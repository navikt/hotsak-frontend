import { memo } from 'react'

import { Sakstype } from '../../types/types.internal'
import { formaterAdresse } from '../../utils/formater'
import { SakLoader } from '../SakLoader'
import { useBehovsmelding } from '../useBehovsmelding'
import { useSak } from '../useSak'
import { FormidlerCard } from '../venstremeny/FormidlerCard'
import { GreitÅViteCard } from '../venstremeny/GreitÅViteCard'
import { LeveringCard } from '../venstremeny/LeveringCard'
import { SøknadCard } from '../venstremeny/SøknadCard'

export const Søknadsinfo = memo(() => {
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
      <GreitÅViteCard greitÅViteFakta={sak.data.greitÅViteFaktum} />
    </>
  )
})

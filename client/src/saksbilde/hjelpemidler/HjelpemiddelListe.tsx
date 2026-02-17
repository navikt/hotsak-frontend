import { Box, Heading, VStack } from '@navikt/ds-react'
import { memo, useMemo } from 'react'

import { useArtiklerForSak } from '../../sak/felles/useArtiklerForSak.ts'
import { BehovsmeldingType, type Innsenderbehovsmelding } from '../../types/BehovsmeldingTypes.ts'
import { type Sak } from '../../types/types.internal.ts'
import { storForbokstavIOrd } from '../../utils/formater.ts'
import { BrukersFunksjon } from './BrukersFunksjon.tsx'
import { Hast } from './Hast.tsx'
import { Hjelpemiddel } from './Hjelpemiddel.tsx'
import { OebsAlert } from './OebsAlert.tsx'
import { FrittståendeTilbehør } from './TilbehørListe.tsx'
import {
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
  useProduktLagerInfo,
} from './useAlternativeProdukter.ts'
import { useHjelpemiddelprodukter } from './useHjelpemiddelprodukter.ts'
import { Varsler } from './Varsel.tsx'
import { useSummering } from '../../sak/v2/behovsmelding/summering/useSummering.ts'
import { Skillelinje } from '../../felleskomponenter/Strek.tsx'
import { Etikett } from '../../felleskomponenter/typografi.tsx'

interface HjelpemiddelListeProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function HjelpemiddelListe({ sak, behovsmelding }: HjelpemiddelListeProps) {
  const { artikler } = useArtiklerForSak(sak.sakId)

  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)
  const { brukersituasjon, levering, saksbehandlingvarsel } = behovsmelding
  const hjelpemidler = behovsmelding.hjelpemidler.hjelpemidler
  const tilbehør = behovsmelding.hjelpemidler.tilbehør
  const { totaltAntall } = useSummering(hjelpemidler, tilbehør)

  const alleHmsNr = useMemo(() => {
    return [
      ...hjelpemidler.flatMap((hjelpemiddel) => [
        hjelpemiddel.produkt.hmsArtNr,
        ...hjelpemiddel.tilbehør.map((tilbehør) => tilbehør.hmsArtNr),
      ]),
      ...tilbehør.map((tilbehør) => tilbehør.hmsArtNr),
    ]
  }, [hjelpemidler, tilbehør])

  const alleHjelpemidler = useMemo(() => {
    return hjelpemidler.map((hjelpemiddel) => hjelpemiddel.produkt.hmsArtNr)
  }, [hjelpemidler])

  const { data: hjelpemiddelprodukter } = useHjelpemiddelprodukter(alleHmsNr)
  const { alternativeProdukterByHmsArtNr, harOppdatertLagerstatus } = useAlternativeProdukter(alleHjelpemidler)
  const { produkter: lagerinfoForProdukter } = useProduktLagerInfo(alleHmsNr)
  const funksjonsbeskrivelse = brukersituasjon.funksjonsbeskrivelse

  return (
    <VStack gap="4">
      <Heading level="1" size="small" visuallyHidden={true}>
        {storForbokstavIOrd(sak.sakstype)}
      </Heading>
      {saksbehandlingvarsel.length > 0 && <Varsler varsler={saksbehandlingvarsel} />}
      {levering.hast && <Hast hast={levering.hast} />}

      {hjelpemidler.length > 0 && (
        <Heading level="2" size="medium">
          Hjelpemidler
        </Heading>
      )}
      {behovsmelding.type === BehovsmeldingType.SØKNAD && artiklerSomIkkeFinnesIOebs.length > 0 && (
        <OebsAlert hjelpemidler={artiklerSomIkkeFinnesIOebs} />
      )}
      {hjelpemidler.map((hjelpemiddel) => (
        <Box.New key={hjelpemiddel.produkt.hmsArtNr} background="neutral-soft" padding="4">
          <Hjelpemiddel
            sak={sak}
            hjelpemiddel={hjelpemiddel}
            produkter={hjelpemiddelprodukter}
            minmaxStyrt={
              lagerinfoForProdukter[hjelpemiddel.produkt.hmsArtNr]?.wareHouseStock?.some((l) => l?.minmax === true) ||
              false
            }
            alternativeProdukter={
              alternativeProdukterByHmsArtNr[hjelpemiddel.produkt.hmsArtNr] ?? ingenAlternativeProdukterForHmsArtNr
            }
            harOppdatertLagerstatus={harOppdatertLagerstatus}
          />
        </Box.New>
      ))}
      {tilbehør && tilbehør.length > 0 && (
        <>
          <Heading level="2" size="small">
            Tilbehør
          </Heading>
          <FrittståendeTilbehør sakId={sak.sakId} tilbehør={tilbehør} produkter={hjelpemiddelprodukter} />
        </>
      )}
      <VStack gap="1">
        <Skillelinje />
        <Etikett>{`Totalt ${totaltAntall} stk. inkl. tilbehør`}</Etikett>
        <Skillelinje />
      </VStack>

      {funksjonsbeskrivelse && <BrukersFunksjon funksjonsbeskrivelse={funksjonsbeskrivelse} />}
    </VStack>
  )
}

export default memo(HjelpemiddelListe)

import { VStack } from '@navikt/ds-react'
import { memo, useMemo } from 'react'

import { CollapsiblePanel } from '../../../felleskomponenter/panel/CollapsiblePanel.tsx'
import { Hast } from '../../../saksbilde/hjelpemidler/Hast.tsx'
import { OebsAlert } from '../../../saksbilde/hjelpemidler/OebsAlert.tsx'
import {
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
  useProduktLagerInfo,
} from '../../../saksbilde/hjelpemidler/useAlternativeProdukter.ts'
import { useHjelpemiddelprodukter } from '../../../saksbilde/hjelpemidler/useHjelpemiddelprodukter.ts'
import { BehovsmeldingType, type Innsenderbehovsmelding } from '../../../types/BehovsmeldingTypes.ts'
import { Sak } from '../../../types/types.internal.ts'
import { useArtiklerForSak } from '../../felles/useArtiklerForSak.ts'
import { HjelpemiddelV2 } from './HjelpemiddelV2BoxTest.tsx'
import { useSummering } from './summering/useSummering.ts'
import { FrittStåendeTilbehørV2 } from './tilbehør/TilbehørlisteV2.tsx'

interface HjelpemidlerProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function Hjelpemidler({ sak, behovsmelding }: HjelpemidlerProps) {
  const hjelpemidler = behovsmelding.hjelpemidler.hjelpemidler
  const tilbehør = behovsmelding.hjelpemidler.tilbehør

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
  const { artikler } = useArtiklerForSak(sak.sakId)
  const artiklerSomIkkeFinnesIOebs = artikler.filter((artikkel) => !artikkel.finnesIOebs)

  const {
    antallHjelpemidler,
    antallTilbehørTilknyttetHjelpemidler,
    harTilknyttedeTilbehør,
    antallFrittståendeTilbehør,
  } = useSummering(hjelpemidler, tilbehør)

  return (
    <VStack gap="space-16" paddingInline="space-0 space-12">
      {behovsmelding.levering.hast && <Hast hast={behovsmelding.levering.hast} />}
      {behovsmelding.type === BehovsmeldingType.SØKNAD && artiklerSomIkkeFinnesIOebs.length > 0 && (
        <OebsAlert hjelpemidler={artiklerSomIkkeFinnesIOebs} />
      )}

      {hjelpemidler.length > 0 && (
        <CollapsiblePanel
          label="Hjelpemidler"
          detaljer={`Totalt ${antallHjelpemidler} hjelpemidler${harTilknyttedeTilbehør ? ` og ${antallTilbehørTilknyttetHjelpemidler} stk tilbehør` : ''}`}
        >
          <VStack gap="space-12" paddingInline="space-2" paddingBlock="space-20 space-0">
            {hjelpemidler.map((hjelpemiddel) => (
              <HjelpemiddelV2
                sak={sak}
                hjelpemiddel={hjelpemiddel}
                produkter={hjelpemiddelprodukter}
                minmaxStyrt={
                  lagerinfoForProdukter[hjelpemiddel.produkt.hmsArtNr]?.wareHouseStock?.some(
                    (l) => l?.minmax === true
                  ) || false
                }
                alternativeProdukter={
                  alternativeProdukterByHmsArtNr[hjelpemiddel.produkt.hmsArtNr] ?? ingenAlternativeProdukterForHmsArtNr
                }
                harOppdatertLagerstatus={harOppdatertLagerstatus}
              />
            ))}
          </VStack>
        </CollapsiblePanel>
      )}

      {tilbehør && tilbehør.length > 0 && (
        <CollapsiblePanel label="TILBEHØR" detaljer={`Totalt ${antallFrittståendeTilbehør} stk`}>
          <FrittStåendeTilbehørV2 sakId={sak.sakId} tilbehør={tilbehør} produkter={hjelpemiddelprodukter} />
        </CollapsiblePanel>
      )}
    </VStack>
  )
}

export default memo(Hjelpemidler)

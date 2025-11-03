import { Box, Button, Heading, HStack, Select, Tag, VStack } from '@navikt/ds-react'
import { memo, useMemo } from 'react'
import { Brødtekst } from '../../../../../felleskomponenter/typografi'
import {
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
  useProduktLagerInfo,
} from '../../../../../saksbilde/hjelpemidler/useAlternativeProdukter'
import { useHjelpemiddelprodukter } from '../../../../../saksbilde/hjelpemidler/useHjelpemiddelprodukter'
import { Innsenderbehovsmelding } from '../../../../../types/BehovsmeldingTypes'
import { OppgaveStatusLabel, Sak } from '../../../../../types/types.internal'
import { storForbokstavIAlleOrd } from '../../../../../utils/formater'
import { HjelpemiddelBehandlingEksperiment } from './HjelpemiddelBehandlingEksperiment'
import { FrittStåendeTilbehørBehandling, TilbehørListeBehandling } from './TilbehørBehandling'
import { Skillelinje } from '../../../../../felleskomponenter/Strek'
import { PlusCircleIcon } from '@navikt/aksel-icons'
import { useSaksbehandlingEksperimentContext } from '../SaksbehandlingEksperimentProvider'

interface BehandlingEksperimentPanelProps {
  sak: Sak
  behovsmelding: Innsenderbehovsmelding
}

function BehandlingEksperimentPanel({ sak, behovsmelding }: BehandlingEksperimentPanelProps) {
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
  const { setBrevKolonne } = useSaksbehandlingEksperimentContext()

  return (
    <Box.New
      background="default"
      borderRadius="large"
      padding={'space-16'}
      style={{ height: '100%', overflowY: 'auto' }}
    >
      <VStack gap="4">
        {hjelpemidler.length > 0 && (
          <Heading level="2" size="medium">
            Behandling
          </Heading>
        )}
        <HStack gap="space-4">
          <Tag variant="info-moderate" size="small">
            {OppgaveStatusLabel.get(sak.status)}
          </Tag>
          <Brødtekst>av {storForbokstavIAlleOrd(sak.saksbehandler?.navn)}</Brødtekst>
        </HStack>

        {hjelpemidler.map((hjelpemiddel) => (
          <>
            <Box.New key={hjelpemiddel.produkt.hmsArtNr} background="info-moderate" padding="4" borderRadius="large">
              <HjelpemiddelBehandlingEksperiment
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
            </Box.New>
            {hjelpemiddel.tilbehør.length > 0 && (
              <TilbehørListeBehandling tilbehør={hjelpemiddel.tilbehør} produkter={hjelpemiddelprodukter} />
            )}
          </>
        ))}
        {tilbehør && tilbehør.length > 0 && (
          <FrittStåendeTilbehørBehandling tilbehør={tilbehør} produkter={hjelpemiddelprodukter} />
        )}
      </VStack>
      <Skillelinje />
      <Box.New>
        <VStack gap="4">
          <Heading size="small" level="2">
            Sett resultat
          </Heading>
          <div>
            <Select size="small" label="Velg resultat" style={{ width: 'auto' }}>
              <option value="godkjent">Innvilget</option>
              <option value="avslått">Avslått</option>
              <option value="mer informasjon nødvendig">Delvis innvilget</option>
            </Select>
          </div>
          <div>
            <Button variant="secondary" size="small" icon={<PlusCircleIcon />} onClick={() => setBrevKolonne(true)}>
              Åpne brepanelet
            </Button>
          </div>
        </VStack>
      </Box.New>
    </Box.New>
  )
}

export default memo(BehandlingEksperimentPanel)

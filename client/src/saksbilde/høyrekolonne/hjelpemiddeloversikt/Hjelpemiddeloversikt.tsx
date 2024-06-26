import { BodyShort, Box, HGrid, Label, VStack } from '@navikt/ds-react'

import { Boble } from '../../../felleskomponenter/Boble'
import { Strek } from '../../../felleskomponenter/Strek'
import { TooltipWrapper } from '../../../felleskomponenter/TooltipWrapper'
import { HjelpemiddelArtikkel } from '../../../types/types.internal'
import { formaterDato } from '../../../utils/dato'
import { storForbokstavIAlleOrd } from '../../../utils/formater'
import { useSak } from '../../useSak'
import { KolonneOppsett, KolonneTittel } from '../Høyrekolonne'
import { useHjelpemiddeloversikt } from './useHjelpemiddeloversikt'

export function Hjelpemiddeloversikt() {
  const { sak } = useSak()
  const { hjelpemiddelArtikler, isError, isLoading, isFromVedtak } = useHjelpemiddeloversikt(
    sak?.data.personinformasjon.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )

  if (isError) {
    return (
      <KolonneOppsett>
        <Box paddingBlock="4">
          <BodyShort>Feil ved henting av brukers hjelpemiddeloversikt.</BodyShort>
        </Box>
      </KolonneOppsett>
    )
  }

  if (isLoading) {
    return (
      <KolonneOppsett>
        <Box paddingBlock="4">
          <BodyShort>Henter brukers hjelpemiddeloversikt.</BodyShort>
        </Box>
      </KolonneOppsett>
    )
  }

  if (!hjelpemiddelArtikler || hjelpemiddelArtikler.length === 0) {
    return (
      <KolonneOppsett>
        <Box paddingBlock="4">
          <BodyShort>Bruker har ingen hjelpemidler fra før.</BodyShort>
        </Box>
      </KolonneOppsett>
    )
  }

  const artiklerByKategori = grupperPåKategori(hjelpemiddelArtikler)

  return (
    <KolonneOppsett>
      <VStack as="li" gap="2">
        <KolonneTittel>Utlånsoversikt</KolonneTittel>
        {isFromVedtak && <li>Per {formaterDato(sak?.data.vedtak?.vedtaksdato)}, da vedtaket ble gjort</li>}
        {Object.keys(artiklerByKategori)
          .sort()
          .map((kategori) => (
            <div key={kategori}>
              <Label size="small">{kategori}</Label>
              <Artikler artikler={artiklerByKategori[kategori]} />
              <Strek />
            </div>
          ))}
      </VStack>
    </KolonneOppsett>
  )
}

function Artikler({ artikler }: { artikler: HjelpemiddelArtikkel[] }) {
  return (
    <VStack gap="2">
      {artikler.map((artikkel) => {
        const artikkelBeskrivelse = storForbokstavIAlleOrd(artikkel.grunndataProduktNavn || artikkel.beskrivelse)
        return (
          <HGrid
            key={`${artikkel.hmsnr}_${artikkel.datoUtsendelse}`}
            gap="3"
            columns="min-content min-content auto 50px"
            align="center"
          >
            <BodyShort size="small">{formaterDato(artikkel.datoUtsendelse)}</BodyShort>
            <BodyShort size="small">{artikkel.hmsnr}</BodyShort>
            <TooltipWrapper visTooltip={artikkelBeskrivelse.length > 28} content={artikkelBeskrivelse}>
              <BodyShort size="small" truncate>
                {artikkelBeskrivelse}
              </BodyShort>
            </TooltipWrapper>
            <Boble>
              <BodyShort size="small">{`${artikkel.antall} ${artikkel.antallEnhet.toLowerCase()}`}</BodyShort>
            </Boble>
          </HGrid>
        )
      })}
    </VStack>
  )
}

function grupperPåKategori(artikler: HjelpemiddelArtikkel[]) {
  return artikler.reduce<Record<string, HjelpemiddelArtikkel[]>>((gruppe, artikkel) => {
    const { isoKategori, grunndataKategoriKortnavn } = artikkel
    const nøkkel = grunndataKategoriKortnavn ? grunndataKategoriKortnavn : isoKategori
    if (!gruppe[nøkkel]) {
      gruppe[nøkkel] = []
    }
    gruppe[nøkkel].push(artikkel)
    return gruppe
  }, {})
}

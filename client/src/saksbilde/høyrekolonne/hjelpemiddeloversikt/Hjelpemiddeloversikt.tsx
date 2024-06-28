import { BodyShort, HGrid, Label, VStack } from '@navikt/ds-react'
import { useMemo } from 'react'

import { Boble } from '../../../felleskomponenter/Boble'
import { TooltipWrapper } from '../../../felleskomponenter/TooltipWrapper'
import { Tekst } from '../../../felleskomponenter/typografi.tsx'
import { HjelpemiddelArtikkel } from '../../../types/types.internal'
import { formaterDato } from '../../../utils/dato'
import { storForbokstavIAlleOrd } from '../../../utils/formater'
import { useSak } from '../../useSak'
import { HøyrekolonneInnslag } from '../HøyrekolonneInnslag.tsx'
import { HøyrekolonnePanel } from '../HøyrekolonnePanel.tsx'
import { useHjelpemiddeloversikt } from './useHjelpemiddeloversikt'

export function Hjelpemiddeloversikt() {
  const { sak } = useSak()
  const {
    hjelpemiddelArtikler: artikler,
    error,
    isLoading,
    isFromVedtak,
  } = useHjelpemiddeloversikt(sak?.data.personinformasjon.fnr, sak?.data.vedtak?.vedtaksgrunnlag)
  const artiklerByKategori = useArtiklerByKategori(artikler)
  return (
    <HøyrekolonnePanel
      tittel="Utlånsoversikt"
      error={error && 'Feil ved henting av brukers hjelpemiddeloversikt.'}
      loading={isLoading && 'Henter brukers hjelpemiddeloversikt...'}
    >
      {isFromVedtak && <Tekst spacing>Per {formaterDato(sak?.data.vedtak?.vedtaksdato)}, da vedtaket ble gjort</Tekst>}
      {artikler.length > 0 ? (
        <VStack as="ul" gap="3">
          {artiklerByKategori.map(([kategori, artikler]) => (
            <HøyrekolonneInnslag key={kategori}>
              <Label size="small">{kategori}</Label>
              <Artikler artikler={artikler} />
            </HøyrekolonneInnslag>
          ))}
        </VStack>
      ) : (
        <Tekst>Bruker har ingen hjelpemidler fra før.</Tekst>
      )}
    </HøyrekolonnePanel>
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

function useArtiklerByKategori(artikler: HjelpemiddelArtikkel[]): [string, HjelpemiddelArtikkel[]][] {
  return useMemo(() => {
    const resultat = artikler.reduce<Record<string, HjelpemiddelArtikkel[]>>((grupper, artikkel) => {
      const { isoKategori, grunndataKategoriKortnavn } = artikkel
      const kategori = grunndataKategoriKortnavn || isoKategori
      if (!grupper[kategori]) {
        grupper[kategori] = []
      }
      grupper[kategori].push(artikkel)
      return grupper
    }, {})
    return Object.entries(resultat).sort(([a], [b]) => a.localeCompare(b))
  }, [artikler])
}

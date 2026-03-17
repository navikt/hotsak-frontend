import { BodyLong, Detail, HStack, Label, VStack } from '@navikt/ds-react'
import { useMemo } from 'react'
import { useSak } from '../../../saksbilde/useSak'
import { useHjelpemiddeloversikt } from '../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { useArtiklerByKategori } from './useArtiklerByKategori'
import { Artikler } from './Artikler'
import { SidebarPanel } from './SidebarPanel'
import { Tekst, TextContainer } from '../../../felleskomponenter/typografi'
import { formaterDato } from '../../../utils/dato'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { useHøreapparatVedtak } from '../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHøreapparatVedtak'
import { useMiljø } from '../../../utils/useMiljø'

export function UtlånsoversiktV2() {
  const { sak } = useSak()
  const { erProd } = useMiljø()
  const {
    hjelpemiddelArtikler: artikler,
    error: errorHjmOversikt,
    isLoading: isLoadingHjmOversikt,
    isFromVedtak: isFromVedtakHjmOversikt,
  } = useHjelpemiddeloversikt(sak?.data.bruker.fnr, sak?.data.vedtak?.vedtaksgrunnlag)
  const artiklerByKategori = useArtiklerByKategori(artikler)

  const totaltAntall = useMemo(() => artikler.reduce((sum, artikkel) => sum + artikkel.antall, 0), [artikler])

  const {
    høreapparatVedtak,
    error: errorHaVedtak,
    isLoading: isLoadingHaVedtak,
    isFromVedtak: isFromVedtakHaVedtak,
  } = useHøreapparatVedtak(sak?.data.bruker.fnr, sak?.data.vedtak?.vedtaksgrunnlag)
  const harHøreapparatVedtak = !erProd && !!høreapparatVedtak?.harVedtak && !!høreapparatVedtak?.vedtaksdato

  return (
    <>
      {harHøreapparatVedtak && (
        <SidebarPanel
          tittel="Tilskudd til høreapparat"
          error={errorHaVedtak && 'Feil ved henting av høreapparatvedtak.'}
          loading={isLoadingHaVedtak && 'Henter høreapparatvedtak...'}
          spacing={false}
          paddingBlock={'space-16 space-0'}
        >
          {isFromVedtakHaVedtak && (
            <Tekst>Per {formaterDato(sak?.data.vedtak?.vedtaksdato)}, da vedtaket ble gjort</Tekst>
          )}
          <VStack gap="space-2">
            <HStack gap="space-8">
              <TextContainer>
                <BodyLong size="small">{`${formaterDato(høreapparatVedtak.vedtaksdato)} Stønad til høreapparat`}</BodyLong>
              </TextContainer>
            </HStack>
            <Skillelinje />
          </VStack>
        </SidebarPanel>
      )}
      <SidebarPanel
        tittel="Utlånte hjelpemidler"
        error={errorHjmOversikt && 'Feil ved henting av brukers hjelpemiddeloversikt.'}
        loading={isLoadingHjmOversikt && 'Henter brukers hjelpemiddeloversikt...'}
        spacing={false}
      >
        {isFromVedtakHjmOversikt && (
          <Tekst>Per {formaterDato(sak?.data.vedtak?.vedtaksdato)}, da vedtaket ble gjort</Tekst>
        )}
        {totaltAntall > 0 && (
          <Detail spacing color="subtle">
            Utlånte hjelpemidler: {totaltAntall} stk
          </Detail>
        )}
        {artikler.length > 0 ? (
          <>
            {artiklerByKategori.map(([kategori, artikler]) => (
              <VStack key={kategori} gap="space-2">
                <Label size="small">{kategori}</Label>
                <Artikler artikler={artikler} />
                <Skillelinje />
              </VStack>
            ))}
          </>
        ) : (
          <Tekst>Bruker har ingen hjelpemidler fra før.</Tekst>
        )}
      </SidebarPanel>
    </>
  )
}

import { WheelchairIcon } from '@navikt/aksel-icons'
import { BodyLong, Detail, HStack, Label, VStack } from '@navikt/ds-react'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { Mellomtittel, Tekst, TextContainer } from '../../../felleskomponenter/typografi'
import { useHjelpemiddeloversikt } from '../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { useSak } from '../../../saksbilde/useSak'
import { useErPilot } from '../../../tilgang/useTilgang'
import { formaterDato } from '../../../utils/dato'
import { Artikler } from './Artikler'
import { SidebarPanel, SidebarPanelBox, SidebarPanelHeading } from './SidebarPanel'
import { useArtiklerByKategori } from './useArtiklerByKategori'

export function UtlånsoversiktV2() {
  const { sak } = useSak()
  const {
    hjelpemiddelArtikler: artikler,
    antallUtlånteHjelpemidler: totaltAntall,
    høreapparatVedtak,
    errorHjmOversikt,
    errorHaVedtak,
    isLoadingHjmOversikt,
    isLoadingHaVedtak,
    isFromVedtak,
  } = useHjelpemiddeloversikt(sak?.data.bruker.fnr, sak?.data.vedtak?.vedtaksgrunnlag)
  const artiklerByKategori = useArtiklerByKategori(artikler)

  const harHøreapparatVedtak = !!høreapparatVedtak?.harVedtak && !!høreapparatVedtak?.vedtaksdato

  const erPilot = useErPilot('hotsakEksperimenter')
  return (
    <>
      {erPilot && (
        <SidebarPanelBox paddingBlock={'space-8 space-0'}>
          <SidebarPanelHeading tittel="Utlånsoversikt" icon={<WheelchairIcon title="Utlånsoversikt" />} />
        </SidebarPanelBox>
      )}
      {isFromVedtak && (
        <SidebarPanelBox paddingBlock={'space-16 space-0'}>
          <Detail spacing color="subtle">
            {`Utlånte hjelpemidler og tilskudd brukeren hadde da vedtaket ble gjort ${formaterDato(sak?.data.vedtak?.vedtaksdato)}.`}
          </Detail>
        </SidebarPanelBox>
      )}

      {(isLoadingHaVedtak || errorHaVedtak || harHøreapparatVedtak) && (
        <SidebarPanel
          tittel={<Mellomtittel>Tilskudd til høreapparat</Mellomtittel>}
          error={errorHaVedtak && 'Feil ved henting av høreapparatvedtak.'}
          loading={isLoadingHaVedtak && 'Henter høreapparatvedtak...'}
          spacing={false}
          paddingBlock={'space-16 space-0'}
        >
          {harHøreapparatVedtak && (
            <VStack gap="space-2">
              <HStack gap="space-8">
                <TextContainer>
                  <BodyLong size="small">{`${formaterDato(høreapparatVedtak.vedtaksdato)} Stønad til høreapparat`}</BodyLong>
                </TextContainer>
              </HStack>
            </VStack>
          )}
          <Skillelinje />
        </SidebarPanel>
      )}

      <SidebarPanel
        tittel={<Mellomtittel>Utlånte hjelpemidler</Mellomtittel>}
        error={errorHjmOversikt && 'Feil ved henting av brukers hjelpemiddeloversikt.'}
        loading={isLoadingHjmOversikt && 'Henter brukers hjelpemiddeloversikt...'}
        spacing={false}
      >
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

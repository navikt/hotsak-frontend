import { BodyLong, Detail, HStack, Label, VStack } from '@navikt/ds-react'
import { useSak } from '../../../saksbilde/useSak'
import { useArtiklerByKategori } from './useArtiklerByKategori'
import { Artikler } from './Artikler'
import { SidebarPanel, SidebarPanelBox, SidebarPanelHeading } from './SidebarPanel'
import { Mellomtittel, Tekst, TextContainer } from '../../../felleskomponenter/typografi'
import { formaterDato } from '../../../utils/dato'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { useHjelpemiddeloversikt } from '../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { useErPilot } from '../../../tilgang/useTilgang'
import { useMiljø } from '../../../utils/useMiljø'
import { WheelchairIcon } from '@navikt/aksel-icons'
import { Sakstype } from '../../../types/types.internal'

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

  const { erIkkeProd } = useMiljø()
  const erHørselshjelpemiddelPilot = useErPilot('hørselshjelpemiddel') || erIkkeProd
  const erBestilling = sak?.data?.sakstype === Sakstype.BESTILLING
  return (
    <>
      {erIkkeProd && !erBestilling && (
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

      {erHørselshjelpemiddelPilot && (isLoadingHaVedtak || errorHaVedtak || harHøreapparatVedtak) && (
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

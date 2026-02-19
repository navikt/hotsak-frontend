import { BodyLong, Detail, HStack, Label, VStack } from '@navikt/ds-react'
import { useMemo } from 'react'
import { useSak } from '../../../saksbilde/useSak'
import { useHjelpemiddeloversikt } from '../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { SidebarPanel } from './SidebarPanel'
import { Tekst, TextContainer } from '../../../felleskomponenter/typografi'
import { formaterDato } from '../../../utils/dato'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { HjelpemiddelArtikkel } from '../../../types/types.internal'

export function UtlånsoversiktV2() {
  const { sak } = useSak()
  const {
    hjelpemiddelArtikler: artikler,
    error,
    isLoading,
    isFromVedtak,
  } = useHjelpemiddeloversikt(sak?.data.bruker.fnr, sak?.data.vedtak?.vedtaksgrunnlag)
  const artiklerByKategori = useArtiklerByKategori(artikler)

  const totaltAntall = useMemo(() => artikler.reduce((sum, artikkel) => sum + artikkel.antall, 0), [artikler])

  return (
    <SidebarPanel
      tittel="Utlånsoversikt"
      error={error && 'Feil ved henting av brukers hjelpemiddeloversikt.'}
      loading={isLoading && 'Henter brukers hjelpemiddeloversikt...'}
      paddingInline="space-0 space-16"
      spacing={false}
    >
      {isFromVedtak && <Tekst>Per {formaterDato(sak?.data.vedtak?.vedtaksdato)}, da vedtaket ble gjort</Tekst>}
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
  )
}

function Artikler({ artikler }: { artikler: HjelpemiddelArtikkel[] }) {
  return (
    <>
      {artikler.map((artikkel) => {
        const artikkelBeskrivelse = artikkel.grunndataProduktNavn || artikkel.beskrivelse
        return (
          <VStack key={`${artikkel.hmsnr}_${artikkel.datoUtsendelse}`}>
            <HStack gap="space-8">
              <TextContainer>
                <BodyLong size="small">{`${artikkel.hmsnr} ${artikkelBeskrivelse}`}</BodyLong>
              </TextContainer>
            </HStack>
            <HStack>
              <Detail color="subtle">{`${artikkel.antall} ${artikkel.antallEnhet.toLowerCase()} - utlånt ${formaterDato(artikkel.datoUtsendelse)}`}</Detail>
            </HStack>
          </VStack>
        )
      })}
    </>
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

import { VStack } from '@navikt/ds-react'
import { useMemo } from 'react'
import { useUtsendingsInfo } from '../../../brev/useUtsendingsInfo.ts'
import { ListeUtenPunkt } from '../../../felleskomponenter/Liste.tsx'
import { Tekst } from '../../../felleskomponenter/typografi.tsx'
import { SidebarPanel } from '../../../sak/v2/sidebars/SidebarPanel.tsx'
import { HistorikkHendelse } from './HistorikkHendelse'
import { useSakshistorikk } from './useSakshistorikk.ts'
import { lagUtsendingsHendelser } from './utsendingsHendelse.ts'
import { useBrevMetadata } from '../../../brev/useBrevMetadata.ts'
import { useMiljø } from '../../../utils/useMiljø.ts'

export function Historikk() {
  const { hendelser, error, isLoading } = useSakshistorikk()
  const { utsendingsinfo, harUtsendingsInfo, datoEkspedert } = useUtsendingsInfo()
  const { gjeldendeBrev: brevMetadata } = useBrevMetadata()
  const erDev = useMiljø()

  const alleHendelser = useMemo(() => {
    if (!harUtsendingsInfo || !utsendingsinfo || !erDev) return hendelser

    const utsendingsHendelser = lagUtsendingsHendelser(utsendingsinfo, datoEkspedert || brevMetadata?.sendt || '')

    return [...hendelser, ...utsendingsHendelser].sort(
      (a, b) => new Date(b.opprettet).getTime() - new Date(a.opprettet).getTime()
    )
  }, [hendelser, utsendingsinfo, harUtsendingsInfo, datoEkspedert, brevMetadata])

  return (
    <SidebarPanel
      tittel="Historikk"
      error={error && 'Feil ved henting av historikk.'}
      loading={isLoading && 'Henter historikk...'}
    >
      {alleHendelser.length > 0 ? (
        <VStack as={ListeUtenPunkt} gap="space-8">
          {alleHendelser.map((it) => (
            <HistorikkHendelse key={it.id} {...it} />
          ))}
        </VStack>
      ) : (
        <Tekst>Ingen hendelser.</Tekst>
      )}
    </SidebarPanel>
  )
}

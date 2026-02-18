import { VStack } from '@navikt/ds-react'
import { ListeUtenPunkt } from '../../../felleskomponenter/Liste.tsx'
import { Tekst } from '../../../felleskomponenter/typografi.tsx'
import { SidebarPanel } from '../../../sak/v2/sidebars/SidebarPanel.tsx'
import { HistorikkHendelse } from './HistorikkHendelse'
import { useSakshistorikk } from './useSakshistorikk.ts'

export function Historikk() {
  const { hendelser, error, isLoading } = useSakshistorikk()
  return (
    <SidebarPanel
      tittel="Historikk"
      error={error && 'Feil ved henting av historikk.'}
      loading={isLoading && 'Henter historikk...'}
    >
      {hendelser.length > 0 ? (
        <VStack as={ListeUtenPunkt} gap="space-8">
          {hendelser.map((it) => (
            <HistorikkHendelse key={it.id} {...it} />
          ))}
        </VStack>
      ) : (
        <Tekst>Ingen hendelser.</Tekst>
      )}
    </SidebarPanel>
  )
}

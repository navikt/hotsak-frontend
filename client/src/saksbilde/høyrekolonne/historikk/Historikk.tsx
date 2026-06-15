import { ClockDashedIcon } from '@navikt/aksel-icons'
import { List, VStack } from '@navikt/ds-react'
import { Mellomtittel, Tekst } from '../../../felleskomponenter/typografi.tsx'
import { SidebarPanel } from '../../../sak/v2/sidebars/SidebarPanel.tsx'
import { useErPilot } from '../../../tilgang/useTilgang.ts'
import { HistorikkHendelse } from './HistorikkHendelse'
import { useSakshistorikk } from './useSakshistorikk.ts'

export function Historikk() {
  const { hendelser, error, isLoading } = useSakshistorikk()
  const erPilot = useErPilot('hotsakEksperimenter')

  return (
    <SidebarPanel
      tittel={erPilot ? 'Historikk' : <Mellomtittel>Historikk</Mellomtittel>}
      error={error && 'Feil ved henting av historikk.'}
      icon={erPilot && <ClockDashedIcon title="Sakshistorikk" />}
      loading={isLoading && 'Henter historikk...'}
    >
      {hendelser.length > 0 ? (
        <VStack as={List} gap="space-8" paddingBlock="space-8">
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

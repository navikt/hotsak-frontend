import { List, VStack } from '@navikt/ds-react'
import { Mellomtittel, Tekst } from '../../../felleskomponenter/typografi.tsx'
import { SidebarPanel } from '../../../sak/v2/sidebars/SidebarPanel.tsx'
import { HistorikkHendelse } from './HistorikkHendelse'
import { useSakshistorikk } from './useSakshistorikk.ts'
import { ClockDashedIcon } from '@navikt/aksel-icons'
import { useMiljø } from '../../../utils/useMiljø.ts'
import { useSak } from '../../useSak.ts'
import { Sakstype } from '../../../types/types.internal.ts'

export function Historikk() {
  const { hendelser, error, isLoading } = useSakshistorikk()
  const { erProd } = useMiljø()
  const { sak } = useSak()

  const erBestilling = sak?.data?.sakstype === Sakstype.BESTILLING

  return (
    <SidebarPanel
      tittel={erProd || erBestilling ? <Mellomtittel>Historikk</Mellomtittel> : 'Historikk'}
      error={error && 'Feil ved henting av historikk.'}
      icon={!erProd && !erBestilling && <ClockDashedIcon title="Sakshistorikk" />}
      loading={isLoading && 'Henter historikk...'}
    >
      {hendelser.length > 0 ? (
        <VStack as={List} gap="space-8">
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

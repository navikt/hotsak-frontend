import { EnvelopeOpenIcon, NotePencilIcon, ParagraphIcon } from '@navikt/aksel-icons'
import { Tabs, Tag } from '@navikt/ds-react'
import { NotificationBadge } from '../../../../saksbilde/høyrekolonne/notat/NotificationBadge'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'
import { HøyrekolonneTabs } from './SaksbehandlingEksperimentProviderTypes'

export function TingÅGjøreEksperiment() {
  const { valgtHøyreKolonneTab, setValgtHøyreKolonneTab } = useSaksbehandlingEksperimentContext()
  return (
    <Tabs
      size="small"
      value={valgtHøyreKolonneTab.toString()}
      onChange={(value) => setValgtHøyreKolonneTab(value as HøyrekolonneTabs)}
      loop
      iconPosition="top"
    >
      <Tabs.List style={{ height: `60px` }}>
        <Tabs.Tab
          value={HøyrekolonneTabs.NOTATER}
          label="Notater"
          icon={
            <>
              <NotePencilIcon title="Notat" />
              <Tag variant="neutral-moderate" size="xsmall" style={{ position: 'relative' }} data-testid="notatteller">
                2{true && <NotificationBadge data-testid="utkast-badge" />}
              </Tag>
            </>
          }
        />
        <Tabs.Tab value={HøyrekolonneTabs.BEHANDLING} label="Behandling" icon={<ParagraphIcon title="Behandling" />} />
        <Tabs.Tab
          value={HøyrekolonneTabs.BREV}
          label="Brev"
          icon={
            <>
              <EnvelopeOpenIcon title="Brev" />

              <Tag variant="neutral-moderate" size="xsmall" style={{ position: 'relative' }} data-testid="notatteller">
                3{true && <NotificationBadge data-testid="utkast-badge" />}
              </Tag>
            </>
          }
        />
      </Tabs.List>
    </Tabs>
  )
}

import { EnvelopeOpenIcon, NotePencilIcon, ParagraphIcon } from '@navikt/aksel-icons'
import { Tabs, Tag } from '@navikt/ds-react'
import { HøyrekolonnePanel } from '../../../../saksbilde/høyrekolonne/HøyrekolonnePanel'
import { Notater } from '../../../../saksbilde/høyrekolonne/notat/Notater'
import { NotificationBadge } from '../../../../saksbilde/høyrekolonne/notat/NotificationBadge'
import { useSak } from '../../../../saksbilde/useSak'
import { useSaksregler } from '../../../../saksregler/useSaksregler'
import { BrevPanelEksperiment } from '../brev/BrevPanelEksperiment'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'
import { HøyrekolonneTabs } from './SaksbehandlingEksperimentProviderTypes'

export function TingÅGjøreEksperiment() {
  const { valgtHøyreKolonneTab, setValgtHøyreKolonneTab } = useSaksbehandlingEksperimentContext()
  const { sak } = useSak()
  const { kanBehandleSak } = useSaksregler()

  return (
    <div style={{ height: '100%' }}>
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
                <Tag
                  variant="neutral-moderate"
                  size="xsmall"
                  style={{ position: 'relative' }}
                  data-testid="notatteller"
                >
                  2{true && <NotificationBadge data-testid="utkast-badge" />}
                </Tag>
              </>
            }
          />
          <Tabs.Tab
            value={HøyrekolonneTabs.BEHANDLING}
            label="Behandling"
            icon={<ParagraphIcon title="Behandling" />}
          />
          <Tabs.Tab
            value={HøyrekolonneTabs.BREV}
            label="Brev"
            icon={
              <>
                <EnvelopeOpenIcon title="Brev" />
                <Tag
                  variant="neutral-moderate"
                  size="xsmall"
                  style={{ position: 'relative' }}
                  data-testid="notatteller"
                >
                  3{true && <NotificationBadge data-testid="utkast-badge" />}
                </Tag>
              </>
            }
          />
        </Tabs.List>
        <div style={{ height: '100%' }}>
          {sak != null && (
            <Tabs.Panel value={HøyrekolonneTabs.NOTATER.toString()}>
              <HøyrekolonnePanel tittel="Notater">
                <Notater sakId={sak.data.sakId} lesevisning={!kanBehandleSak} />
              </HøyrekolonnePanel>
            </Tabs.Panel>
          )}
          <Tabs.Panel value={HøyrekolonneTabs.BREV.toString()}>
            <BrevPanelEksperiment />
          </Tabs.Panel>
        </div>
      </Tabs>
    </div>
  )
}

import { EnvelopeOpenIcon, NotePencilIcon, ParagraphIcon } from '@navikt/aksel-icons'
import { Tabs, Tag } from '@navikt/ds-react'
import { NotificationBadge } from '../../../../saksbilde/høyrekolonne/notat/NotificationBadge'

export function TingÅGjøreEksperiment() {
  return (
    <Tabs size="small" defaultValue="Behandling" loop iconPosition="top">
      <Tabs.List style={{ height: `60px` }}>
        <Tabs.Tab
          value="Notater"
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
        <Tabs.Tab value="Behandling" label="Behandling" icon={<ParagraphIcon title="Behandling" />} />
        <Tabs.Tab
          value="Brev"
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

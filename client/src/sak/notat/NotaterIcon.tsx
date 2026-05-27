import { NotePencilIcon } from '@navikt/aksel-icons'
import { HStack, Tag } from '@navikt/ds-react'

import { useOppgavekommentarer } from '../../oppgave/kommentar/useOppgavekommentarer'
import { type OppgaveId } from '../../oppgave/oppgaveTypes'
import classes from './NotaterIcon.module.css'
import { NotificationBadge } from './NotificationBadge'
import { useNotater } from './useNotater'

export function NotaterIcon({ oppgaveId, sakId }: { oppgaveId?: OppgaveId; sakId?: string }) {
  const { antallKommentarer } = useOppgavekommentarer(oppgaveId)
  const { antallNotater, harUtkast, isLoading } = useNotater(sakId)

  const antall = antallKommentarer + antallNotater

  return (
    <HStack align="center" gap="space-0">
      <NotePencilIcon title="Notater" />
      {!isLoading && (
        <Tag
          size="xsmall"
          variant={`${antall > 0 ? 'info-moderate' : 'neutral-moderate'}`}
          className={classes.tag}
          data-testid="notatteller"
        >
          {antall}
          {harUtkast && <NotificationBadge data-testid="utkast-badge" />}
        </Tag>
      )}
    </HStack>
  )
}

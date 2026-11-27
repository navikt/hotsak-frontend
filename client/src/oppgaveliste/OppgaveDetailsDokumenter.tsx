import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { BodyShort, HGrid, Loader } from '@navikt/ds-react'
import { Fragment } from 'react'

import { JournalposttypeTag } from '../dokument/DokumentTag'
import { FormatDateTime } from '../felleskomponenter/format/FormatDateTime'
import { IconLink } from '../felleskomponenter/IconLink'
import { useAlleJournalposterForSak } from '../saksbilde/useJournalposter'
import classes from './OppgaveDetailsDokumenter.module.css'
import { OppgaveDetailsItem } from './OppgaveDetailsItem'

export function OppgaveDetailsDokumenter({ sakId }: { sakId: string }) {
  const { dokumenter, isLoading } = useAlleJournalposterForSak(sakId)
  return (
    <OppgaveDetailsItem label="Dokumenter">
      {isLoading ? (
        <Loader />
      ) : (
        <HGrid gap="space-8" columns="max-content min-content min-content" align="center">
          {dokumenter.map((dokument) => {
            const href = `/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`
            return (
              <Fragment key={href}>
                <BodyShort
                  as={IconLink}
                  icon={<ExternalLinkIcon />}
                  href={href}
                  size="small"
                  target="_blank"
                  className={classes.text}
                >
                  {dokument.tittel}
                </BodyShort>
                <BodyShort size="small" className={classes.text} title="Tidspunkt for når dokumentet ble opprettet">
                  <FormatDateTime dateTime={dokument.opprettet} />
                </BodyShort>
                <JournalposttypeTag journalposttype={dokument.type} />
              </Fragment>
            )
          })}
        </HGrid>
      )}
    </OppgaveDetailsItem>
  )
}

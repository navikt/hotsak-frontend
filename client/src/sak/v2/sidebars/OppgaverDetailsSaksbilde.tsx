import { Fragment } from 'react'
import { BodyShort, HGrid, InlineMessage, Label, Link, Tag, VStack } from '@navikt/ds-react'
import { DataGridContentProps } from '../../../felleskomponenter/data/DataGrid'
import { Oppgave } from '../../../oppgave/oppgaveTypes'
import { useAlleJournalposterForSak } from '../../../saksbilde/useJournalposter'
import { storForbokstavIOrd } from '../../../utils/formater'

export function OppgaveDetailsSaksbilde({ row: oppgave }: DataGridContentProps<Oppgave>) {
  const { dokumenter } = useAlleJournalposterForSak(oppgave.sakId)

  if (dokumenter.length === 0) {
    return (
      <VStack>
        <InlineMessage status="info" size="small">
          Fant ingen dokumenter for saken
        </InlineMessage>
      </VStack>
    )
  }

  return (
    <VStack>
      <BodyShort>
        <Label size="small">Dokumenter i saken:</Label>
      </BodyShort>
      <HGrid columns="min-content max-content max-content" gap="space-4 space-12">
        {dokumenter.map((dokument) => (
          <Fragment key={dokument.dokumentId}>
            <span aria-hidden>•</span>
            <Link href={`/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`} target="_blank">
              {dokument.tittel}
            </Link>
            <Tag size="xsmall" variant="outline">
              {storForbokstavIOrd(dokument.type)}
            </Tag>
          </Fragment>
        ))}
      </HGrid>
    </VStack>
  )
}

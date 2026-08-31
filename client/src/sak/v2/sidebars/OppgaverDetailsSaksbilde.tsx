import { BodyShort, HGrid, InlineMessage, Label, Link, Tag, VStack } from '@navikt/ds-react'
import { Fragment } from 'react'
import { type DataGridContentProps } from '../../../felleskomponenter/data/DataGrid'
import { type Oppgave } from '../../../oppgave/oppgaveTypes'
import { useAlleJournalposterForSak } from '../../../saksbilde/useJournalposter'
import { storForbokstavIOrd } from '../../../utils/formater'

export function OppgaveDetailsSaksbilde({ row: oppgave }: DataGridContentProps<Oppgave>) {
  const { dokumenter, isLoading, error } = useAlleJournalposterForSak(oppgave.sakId)

  if (!oppgave.sakId) {
    return (
      <InlineMessage status="info" size="small">
        Oppgaven er ikke knyttet til en sak
      </InlineMessage>
    )
  }

  if (isLoading) return <BodyShort size="small">Henter dokumenter ...</BodyShort>

  if (error) {
    return (
      <InlineMessage status="error" size="small">
        Feil ved henting av dokumenter.
      </InlineMessage>
    )
  }

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
            <BodyShort as="span" size="small">
              <Link href={`/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`} target="_blank">
                {dokument.tittel}
              </Link>
            </BodyShort>
            <Tag size="xsmall" variant="outline">
              {storForbokstavIOrd(dokument.type)}
            </Tag>
          </Fragment>
        ))}
      </HGrid>
    </VStack>
  )
}

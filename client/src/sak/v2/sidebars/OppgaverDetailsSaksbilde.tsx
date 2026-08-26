import { BodyShort, HStack, Link, Tag, VStack } from '@navikt/ds-react'
import { DataGridContentProps } from '../../../felleskomponenter/data/DataGrid'
import { Oppgave } from '../../../oppgave/oppgaveTypes'
import { useAlleJournalposterForSak } from '../../../saksbilde/useJournalposter'
import { storForbokstavIOrd } from '../../../utils/formater'

export function OppgaveDetailsSaksbilde({ row: oppgave }: DataGridContentProps<Oppgave>) {
  const { dokumenter } = useAlleJournalposterForSak(oppgave.sakId)
  if (dokumenter.length === 0) {
    return null
  }

  return (
    <VStack>
      <BodyShort>
        <strong>Dokumenter i saken:</strong>
        <ul>
          {dokumenter.map((dokument) => (
            <li key={dokument.dokumentId} style={{ marginBottom: '0.2rem' }}>
              <HStack justify="space-between" width="50%">
                <Link href={`/api/journalpost/${dokument.journalpostId}/${dokument.dokumentId}`} target="_blank">
                  {dokument.tittel}
                </Link>
                <Tag size="small" variant="outline">
                  {storForbokstavIOrd(dokument.type)}
                </Tag>
              </HStack>
            </li>
          ))}
        </ul>
      </BodyShort>
    </VStack>
  )
}

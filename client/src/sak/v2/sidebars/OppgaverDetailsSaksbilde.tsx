import { BodyShort, VStack } from '@navikt/ds-react'
import { DataGridContentProps } from '../../../felleskomponenter/data/DataGrid'
import { Oppgave } from '../../../oppgave/oppgaveTypes'
import { useAlleJournalposterForSak } from '../../../saksbilde/useJournalposter'

export function OppgaveDetailsSaksbilde({ row: oppgave }: DataGridContentProps<Oppgave>) {
  const { dokumenter } = useAlleJournalposterForSak()
  console.log('oppgaver', oppgave)

  return (
    <VStack>
      <BodyShort>
        <strong>Dokumenter i saken:</strong>
        <ul>
          {dokumenter.map((dokument) => (
            <li key={dokument.dokumentId}>
              {dokument.tittel} {dokument.type}
            </li>
          ))}
        </ul>
      </BodyShort>
    </VStack>
  )
}

import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { BodyShort, Link, Table, Tooltip } from '@navikt/ds-react'

import { Etikett } from '../felleskomponenter/typografi'
import type { Dokument } from '../types/types.internal'

export interface DokumentVelgerProps {
  dokument: Dokument
  valgtDokumentID: string
  onClick(): void
}

export function DokumentVelger({ dokument, valgtDokumentID, onClick }: DokumentVelgerProps) {
  return (
    <Table.Row>
      <Table.DataCell>
        {dokument.dokumentID === valgtDokumentID ? (
          <Etikett>
            <Link
              href="#"
              underline={false}
              onClick={(e) => {
                e.preventDefault()
              }}
            >
              {dokument.tittel}
            </Link>
          </Etikett>
        ) : (
          <BodyShort size="small">
            <Link
              href="#"
              underline={false}
              onClick={(e) => {
                e.preventDefault()
                onClick()
              }}
            >
              {dokument.tittel}
            </Link>
          </BodyShort>
        )}
      </Table.DataCell>
      <Table.DataCell style={{ width: '50px' }}>
        <BodyShort size="large">
          <Tooltip content="Åpne i ny fane">
            <Link href={`/api/journalpost/${dokument.journalpostID}/${dokument.dokumentID}`} target="_blank">
              <ExternalLinkIcon title="Åpne i ny fane" />
            </Link>
          </Tooltip>
        </BodyShort>
      </Table.DataCell>
    </Table.Row>
  )
}

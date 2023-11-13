import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { BodyShort, Link, Table, Tooltip } from '@navikt/ds-react'

import React from 'react'
import { Etikett } from '../../felleskomponenter/typografi'
import { Dokument } from '../../types/types.internal'
import { useErMockMiljø } from '../../utils/useerMockMiljø'

const ByggDummyDataUrl = React.lazy(() => import('../../mocks/mockDokument'))

interface DokumentVelgerProps {
  dokument: Dokument
  valgtDokumentID: string
  onClick: () => void
}

export const DokumentVelger: React.FC<DokumentVelgerProps> = ({ dokument, valgtDokumentID, onClick }) => {
  const erMockMiljø = useErMockMiljø()

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
            {erMockMiljø ? (
              <ByggDummyDataUrl tittel={<ExternalLinkIcon />} />
            ) : (
              <Link href={`/api/journalpost/${dokument.journalpostID}/${dokument.dokumentID}`} target="_blank">
                <ExternalLinkIcon title="Åpne i ny fane" />
              </Link>
            )}
          </Tooltip>
        </BodyShort>
      </Table.DataCell>

      {/*<HGrid gap="1" columns="30px auto">

      <BodyShort size="large">
          <Tooltip content="Åpne i ny fane">
            {erMockMiljø ? (
              <ByggDummyDataUrl tittel={<ExternalLinkIcon/>} />
            ) : (
              <Link href={`/api/journalpost/${dokument.journalpostID}/${dokument.dokumentID}`} target="_blank">
                <ExternalLinkIcon title="Åpne i ny fane" />
              </Link>
            )}
          </Tooltip>
        </BodyShort>

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
          <Link href="#"
            underline={false}
            onClick={(e) => {
              e.preventDefault()
              onClick()
            }}
          >
            {dokument.tittel}
          </Link>
        )}

        
        </HGrid>*/}
    </Table.Row>
  )
}

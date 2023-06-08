import { EyeIcon } from '@navikt/aksel-icons'
import { Button } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Dokument } from '../../types/types.internal'

interface DokumentVelgerProps {
  dokument: Dokument
  valgtDokumentID: string
  onClick: () => void
}

export const DokumentVelger: React.FC<DokumentVelgerProps> = ({ dokument, valgtDokumentID, onClick }) => {
  return (
    <li>
      <Avstand marginTop={1} paddingLeft={2}>
        {dokument.dokumentID === valgtDokumentID ? (
          <Button
            role={'link'}
            icon={<EyeIcon aria-hidden />}
            iconPosition="right"
            size="small"
            variant="tertiary"
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            {dokument.tittel}
          </Button>
        ) : (
          <Button
            role={'link'}
            size="small"
            variant="tertiary"
            onClick={(e) => {
              e.preventDefault()
              onClick()
            }}
          >
            {dokument.tittel}
          </Button>
        )}
      </Avstand>
    </li>
  )
}

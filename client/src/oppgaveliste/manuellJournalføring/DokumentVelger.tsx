import { Button } from '@navikt/ds-react'

//import { useState } from 'react'
import { Dokument } from '../../types/types.internal'

interface DokumentVelgerProps {
  dokument: Dokument
}

export const DokumentVelger: React.FC<DokumentVelgerProps> = ({ dokument }) => {
  //const [åpen, settÅpen] = useState(false)
  // const valgt = dokument.dokumentInfoId === valgtDokumentId;

  return (
    <Button role={'link'} size="small" variant="tertiary">
      {dokument.tittel}
    </Button>
  )
}

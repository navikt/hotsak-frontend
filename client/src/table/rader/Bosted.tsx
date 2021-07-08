import React from 'react'

import { TekstMedEllipsis } from '../../TekstMedEllipsis'
import { Tooltip } from '../../Tooltip'
//import { usePersondataSkalAnonymiseres } from '../../../../state/person';
import { CellContent } from './CellContent'

interface BostedProps {
  stedsnavn: string
  oppgavereferanse: string
}

export const Bosted = React.memo(({ stedsnavn, oppgavereferanse }: BostedProps) => {
  //const anonymiseringEnabled = usePersondataSkalAnonymiseres();
  //const bosted = anonymiseringEnabled ? 'Agurkheim' : stedsnavn;
  const bosted = 'Stedet'
  const id = `bosted-${oppgavereferanse}`

  return (
    <CellContent width={128} data-for={id} /*data-tip={bosted}*/>
      <TekstMedEllipsis>{bosted}</TekstMedEllipsis>
      {bosted.length > 18 && <Tooltip id={id} />}
    </CellContent>
  )
})

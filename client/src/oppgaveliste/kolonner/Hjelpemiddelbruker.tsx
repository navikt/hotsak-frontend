import React from 'react'

import { capitalizeName } from '../../utils/stringFormating'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'
import { PersoninfoOppgave } from '../../types/types.internal'

interface HjelpemiddelbrukerProps {
  person: PersoninfoOppgave
  saksID: string
}

const getFormattedName = (personinfo: PersoninfoOppgave): string => {
  const { fornavn, mellomnavn, etternavn } = personinfo

  return capitalizeName(`${etternavn}, ${fornavn} ${mellomnavn ? `${mellomnavn}` : ''}`)
}

export const Hjelpemiddelbruker = React.memo(({ person, saksID }: HjelpemiddelbrukerProps) => {
  const id = `hjelpemiddelbruker-${saksID}`
  const formatertNavn = getFormattedName(person)

  return (
    <div data-for={id} data-tip={formatertNavn}>
      <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
      {formatertNavn.length > 23 && <Tooltip id={id} />}
    </div>
  )
})

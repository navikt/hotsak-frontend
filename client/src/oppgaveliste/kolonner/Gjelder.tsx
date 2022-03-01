import React from 'react'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Tooltip } from '../../felleskomponenter/Tooltip'
import { capitalize } from '../../utils/stringFormating'

interface GjelderProps {
  søknadOm: string
  saksID: string
}

export const Gjelder = React.memo(({ søknadOm, saksID }: GjelderProps) => {
  const id = `gjelder-${saksID}`
  const søknadGjelder = capitalize(søknadOm.replace('Søknad om:', '').trim())

  return (
    <div data-for={id} data-tip={søknadGjelder}>
      <TekstMedEllipsis>{søknadGjelder}</TekstMedEllipsis>
      {søknadGjelder.length > 20 && <Tooltip id={id} />}
    </div>
  )
})

import React from 'react'

import { Tooltip } from '@navikt/ds-react'

import { capitalize } from '../../utils/stringFormating'

import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'

interface GjelderProps {
  søknadOm: string
}

export const Gjelder = React.memo(({ søknadOm }: GjelderProps) => {
  const søknadGjelder = capitalize(søknadOm.replace('Søknad om:', '').replace('Bestilling av:', '').trim())

  const visTooltip = søknadGjelder.length > 20

  if (visTooltip) {
    return (
      <Tooltip content={søknadGjelder}>
        <TekstMedEllipsis>{søknadGjelder}</TekstMedEllipsis>
      </Tooltip>
    )
  }
  return <TekstMedEllipsis>{søknadGjelder}</TekstMedEllipsis>
})

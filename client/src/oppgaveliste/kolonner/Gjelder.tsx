import React from 'react'

import { BodyShort, Tooltip } from '@navikt/ds-react'

import { capitalize } from '../../utils/stringFormating'

interface GjelderProps {
  søknadOm: string
}

export const Gjelder = React.memo(({ søknadOm }: GjelderProps) => {
  const søknadGjelder = capitalize(søknadOm.replace('Søknad om:', '').replace('Bestilling av:', '').trim())

  const visTooltip = søknadGjelder.length > 20

  if (visTooltip) {
    return (
      <Tooltip content={søknadGjelder}>
        <BodyShort size="small" truncate>
          {søknadGjelder}
        </BodyShort>
      </Tooltip>
    )
  }
  return (
    <BodyShort size="small" truncate>
      {søknadGjelder}
    </BodyShort>
  )
})

import React from 'react'

import { IconContainer } from '../../felleskomponenter/IconContainer'
import { Advarselikon } from '../../felleskomponenter/ikoner/Advarselikon'
import { Informasjonikon } from '../../felleskomponenter/ikoner/Informasjonikon'
import { Sjekkikon } from '../../felleskomponenter/ikoner/Sjekkikon'
import { Tekst } from '../../felleskomponenter/typografi'
import { GreitÅViteFaktum, GreitÅViteType } from '../../types/types.internal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { HGrid } from '@navikt/ds-react'

export interface GreitÅViteCardProps {
  greitÅViteFakta: GreitÅViteFaktum[]
  harIngenHjelpemidlerFraFør: boolean
}

export function GreitÅViteCard({ greitÅViteFakta, harIngenHjelpemidlerFraFør }: GreitÅViteCardProps) {
  const fakta = harIngenHjelpemidlerFraFør
    ? [...greitÅViteFakta, { beskrivelse: 'Bruker har ingen hjelpemidler fra før', type: GreitÅViteType.MERKNAD }]
    : [...greitÅViteFakta]

  if (fakta.length > 0) {
    return (
      <Card>
        <CardTitle level="1" size="medium">
          GREIT Å VITE
        </CardTitle>
        <HGrid gap="05" columns="1.25rem auto" style={{ columnGap: 'var(--a-spacing-3)' }}>
          {fakta
            .sort((a, b) => {
              if (a.type === b.type) {
                if (a.beskrivelse < b.beskrivelse) return -1
                if (a.beskrivelse > b.beskrivelse) return 1
                return 0
              }
              if (a.type === GreitÅViteType.ADVARSEL) return -1
              if (b.type === GreitÅViteType.ADVARSEL) return 1
              if (a.type === GreitÅViteType.MERKNAD) return -1
              if (b.type === GreitÅViteType.MERKNAD) return 1
              return 0
            })
            .map((faktum) => {
              return <Rad key={faktum.beskrivelse} type={faktum.type} beskrivelse={faktum.beskrivelse} />
            })}
        </HGrid>
      </Card>
    )
  } else {
    return null
  }
}

function ikon(faktumType: GreitÅViteType) {
  switch (faktumType) {
    case GreitÅViteType.ADVARSEL:
      return <Advarselikon />
    case GreitÅViteType.INFO:
      return <Sjekkikon />
    case GreitÅViteType.MERKNAD:
      return <Informasjonikon />
  }
}

function Rad({ type, beskrivelse }: GreitÅViteFaktum) {
  return (
    <>
      <IconContainer>{ikon(type)}</IconContainer>
      <Tekst>{beskrivelse}</Tekst>
    </>
  )
}

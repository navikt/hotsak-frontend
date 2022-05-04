import React from 'react'

import { IconContainer } from '../../felleskomponenter/IconContainer'
import { Advarselikon } from '../../felleskomponenter/ikoner/Advarselikon'
import { Informasjonikon } from '../../felleskomponenter/ikoner/Informasjonikon'
import { Sjekkikon } from '../../felleskomponenter/ikoner/Sjekkikon'
import { Tekst } from '../../felleskomponenter/typografi'
import { GreitÅViteFaktum, GreitÅViteType } from '../../types/types.internal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Grid } from './Grid'

interface GreitÅViteCardProps {
  greitÅViteFakta: GreitÅViteFaktum[]
  harIngenHjelpemidlerFraFør: boolean
}

const ikon = (faktumType: GreitÅViteType) => {
  switch (faktumType) {
    case GreitÅViteType.ADVARSEL:
      return <Advarselikon />
    case GreitÅViteType.INFO:
      return <Sjekkikon />
    case GreitÅViteType.MERKNAD:
      return <Informasjonikon />
  }
}

const FaktaRad = ({ type, beskrivelse }: GreitÅViteFaktum) => {
  return (
    <>
      <IconContainer>{ikon(type)}</IconContainer>
      <Tekst>{beskrivelse}</Tekst>
    </>
  )
}

export const GreitÅViteCard: React.VFC<GreitÅViteCardProps> = ({ greitÅViteFakta, harIngenHjelpemidlerFraFør }) => {
  const fakta = harIngenHjelpemidlerFraFør
    ? [...greitÅViteFakta, { beskrivelse: 'Bruker har ingen hjelpemidler fra før', type: GreitÅViteType.MERKNAD }]
    : [...greitÅViteFakta]

  if (fakta.length > 0) {
    return (
      <Card>
        <CardTitle>GREIT Å VITE</CardTitle>
        <Grid>
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
              return <FaktaRad key={faktum.beskrivelse} type={faktum.type} beskrivelse={faktum.beskrivelse} />
            })}
        </Grid>
      </Card>
    )
  } else {
    return null
  }
}

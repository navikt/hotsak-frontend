import { Advarselikon } from '../../felleskomponenter/ikoner/Advarselikon'
import { Sjekkikon } from '../../felleskomponenter/ikoner/Sjekkikon'
import { Tekst } from '../../felleskomponenter/typografi'
import { GreitÅViteType, GreitÅViteFaktum } from '../../types/types.internal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Grid } from './Grid'
import { IconContainer } from './IconContainer'

interface GreitÅViteCardProps {
  greitÅViteFakta: GreitÅViteFaktum[]
}

const ikon = (faktumType: GreitÅViteType) => {
  return faktumType === GreitÅViteType.ADVARSEL ? <Advarselikon /> : <Sjekkikon />
}

const FaktaRad = ({ type, beskrivelse }: GreitÅViteFaktum) => {
  return (
    <>
      <IconContainer>{ikon(type)}</IconContainer>
      <Tekst>{beskrivelse}</Tekst>
    </>
  )
}

export const GreitÅViteCard = ({ greitÅViteFakta }: GreitÅViteCardProps) => {
  if (greitÅViteFakta.length > 0) {
    return (
      <Card>
        <CardTitle>GREIT Å VITE</CardTitle>
        <Grid>
          {greitÅViteFakta
            .sort((a, b) => {
              if (a.type === b.type) {
                if (a.beskrivelse < b.beskrivelse) return -1
                if (a.beskrivelse > b.beskrivelse) return 1
                return 0
              }
              if (a.type === GreitÅViteType.ADVARSEL) return -1
              if (b.type === GreitÅViteType.ADVARSEL) return 1
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

import { Normaltekst } from 'nav-frontend-typografi'

import { Advarselikon } from '../../felleskomponenter/ikoner/Advarselikon'
import { Sjekkikon } from '../../felleskomponenter/ikoner/Sjekkikon'
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
      <Normaltekst>{beskrivelse}</Normaltekst>
    </>
  )
}

export const GreitÅViteCard = ({ greitÅViteFakta }: GreitÅViteCardProps) => {
  return (
    <Card>
      <CardTitle>GREIT Å VITE</CardTitle>
      <Grid>
        {greitÅViteFakta.map((faktum) => {
          return <FaktaRad key={faktum.beskrivelse} type={faktum.type} beskrivelse={faktum.beskrivelse} />
        })}
      </Grid>
    </Card>
  )
}

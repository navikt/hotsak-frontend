import { capitalize, capitalizeName } from '../../utils/stringFormating'

import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Grid } from './Grid'
import { IconContainer } from './IconContainer'
import { Tekst } from '../../felleskomponenter/typografi'

interface FormidlerCardProps {
  formidlerNavn: string
  kommune: string
}

export const FormidlerCard = ({ formidlerNavn, kommune }: FormidlerCardProps) => {
  return (
    <Card>
      <CardTitle>FORMIDLER</CardTitle>
      <Grid>
        <IconContainer>
          <Personikon />
        </IconContainer>
        <Tekst>{`${capitalizeName(formidlerNavn)} - ${capitalize(kommune)}`}</Tekst>
      </Grid>
    </Card>
  )
}

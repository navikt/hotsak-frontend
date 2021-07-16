import { Normaltekst } from 'nav-frontend-typografi'

import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Grid } from './Grid'
import {IconContainer} from './IconContainer'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'

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
        <Normaltekst>{`${formidlerNavn} - ${kommune}`}</Normaltekst>
      </Grid>
    </Card>
  )
}

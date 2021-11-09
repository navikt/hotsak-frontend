import { capitalize, capitalizeName } from '../../utils/stringFormating'

import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Grid } from './Grid'
import { IconContainer } from './IconContainer'
import { Tekst } from '../../felleskomponenter/typografi'
import { TelefonIkon } from '../../felleskomponenter/ikoner/TelefonIkon'

interface FormidlerCardProps {
  formidlerNavn: string
  kommune: string
  formidlerTelefon: string
}

export const FormidlerCard = ({ formidlerNavn, kommune, formidlerTelefon }: FormidlerCardProps) => {
  return (
    <Card>
      <CardTitle>FORMIDLER</CardTitle>
      <Grid>
        <IconContainer>
          <Personikon />
        </IconContainer>
        <Tekst>{`${capitalizeName(formidlerNavn)} - ${capitalize(kommune)}`}</Tekst>
        <IconContainer>
          <TelefonIkon />
        </IconContainer>
        <Tekst>{formidlerTelefon}</Tekst>
      </Grid>
    </Card>
  )
}

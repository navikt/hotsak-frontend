import { Normaltekst } from 'nav-frontend-typografi'

import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Grid } from './Grid'
import { IconContainer } from './IconContainer'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { Saksbehandler } from '../../types/types.internal'

interface SaksbehandlerCardProps {
  saksbehandler: Saksbehandler
}

export const SaksbehandlerCard = ({ saksbehandler }: SaksbehandlerCardProps) => {
  if (!saksbehandler) return null

  return (
    <Card>
      <CardTitle>SAKSBEHANDLER</CardTitle>
      <Grid>
        <IconContainer>
          <Personikon />
        </IconContainer>
        <Normaltekst>{saksbehandler.navn}</Normaltekst>
      </Grid>
    </Card>
  )
}

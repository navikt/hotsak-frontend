import React from 'react'

import { capitalize, capitalizeName } from '../../utils/stringFormating'

import { IconContainer } from '../../felleskomponenter/IconContainer'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { TelefonIkon } from '../../felleskomponenter/ikoner/TelefonIkon'
import { Tekst } from '../../felleskomponenter/typografi'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Grid } from './Grid'

interface FormidlerCardProps {
  formidlerNavn: string
  kommune: string
  formidlerTelefon: string
}

export const FormidlerCard: React.VFC<FormidlerCardProps> = ({ formidlerNavn, kommune, formidlerTelefon }) => {
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

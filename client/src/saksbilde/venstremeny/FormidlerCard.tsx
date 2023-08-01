import React from 'react'
import styled from 'styled-components'

import { CopyButton, Tooltip } from '@navikt/ds-react'

import { capitalize, capitalizeName } from '../../utils/stringFormating'

import { IconContainer } from '../../felleskomponenter/IconContainer'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { TelefonIkon } from '../../felleskomponenter/ikoner/TelefonIkon'
import { Tekst } from '../../felleskomponenter/typografi'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { Grid } from './Grid'

interface FormidlerCardProps {
  tittel: string
  formidlerNavn: string
  kommune: string
  formidlerTelefon: string
}

const CopyContainer = styled.div`
  display: flex;
  align-items: center;
`

export const FormidlerCard: React.FC<FormidlerCardProps> = ({ tittel, formidlerNavn, kommune, formidlerTelefon }) => {
  return (
    <Card>
      <CardTitle>{tittel}</CardTitle>
      <CenterGrid>
        <IconContainer>
          <Personikon />
        </IconContainer>
        <CopyContainer>
          <Tekst>{`${capitalizeName(formidlerNavn)} - ${capitalize(kommune)}`}</Tekst>
          <Tooltip content="Kopier formidler navn" placement="bottom">
            <CopyButton title="Kopier formidler navn" size="small" copyText={formidlerNavn} />
          </Tooltip>
        </CopyContainer>
        <IconContainer>
          <TelefonIkon />
        </IconContainer>
        <CopyContainer>
          <Tekst>{formidlerTelefon}</Tekst>
          <Tooltip content="Kopier telefonnummer" placement="bottom">
            <CopyButton title="Kopier telefonnummer" size="small" copyText={formidlerTelefon} />
          </Tooltip>
        </CopyContainer>
      </CenterGrid>
    </Card>
  )
}

const CenterGrid = styled(Grid)`
  align-items: center;
`

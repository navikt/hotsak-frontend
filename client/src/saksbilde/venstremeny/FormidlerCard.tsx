import React from 'react'
import styled from 'styled-components'

import { CopyToClipboard } from '@navikt/ds-react-internal'

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
`

const Clipboard = styled(CopyToClipboard)`
  color: var(--navds-semantic-color-text);
  padding: 0.1rem var(--navds-spacing-3) 0.1rem var(--navds-spacing-3);
`

export const FormidlerCard: React.VFC<FormidlerCardProps> = ({ tittel, formidlerNavn, kommune, formidlerTelefon }) => {
  return (
    <Card>
      <CardTitle>{tittel}</CardTitle>
      <Grid>
        <IconContainer>
          <Personikon />
        </IconContainer>
        <CopyContainer>
          <Tekst>{`${capitalizeName(formidlerNavn)} - ${capitalize(kommune)}`}</Tekst>
          <Clipboard
            popoverText="Navn kopiert"
            title="Kopier formidler navn"
            variant="tertiary"
            size="small"
            copyText={formidlerNavn}
            popoverPlacement="bottom"
          />
        </CopyContainer>
        <IconContainer>
          <TelefonIkon />
        </IconContainer>
        <CopyContainer>
          <Tekst>{formidlerTelefon}</Tekst>
          <Clipboard
            popoverText="Telefonnummer kopiert"
            title="Kopier telefonnummer"
            variant="tertiary"
            size="small"
            copyText={formidlerTelefon}
            popoverPlacement="bottom"
          />
        </CopyContainer>
      </Grid>
    </Card>
  )
}

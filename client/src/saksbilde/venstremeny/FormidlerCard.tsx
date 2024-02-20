import React from 'react'

import { CopyButton, HStack, Tooltip } from '@navikt/ds-react'

import { capitalize, capitalizeName, formatName } from '../../utils/stringFormating'

import { IconContainer, Ikonplaceholder } from '../../felleskomponenter/IconContainer'
import { Personikon } from '../../felleskomponenter/ikoner/Personikon'
import { TelefonIkon } from '../../felleskomponenter/ikoner/TelefonIkon'
import { Tekst } from '../../felleskomponenter/typografi'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import type { Navn } from '../../types/types.internal'

interface FormidlerCardProps {
  tittel: string
  formidlerNavn: string | Navn
  stilling: string
  kommune: string
  formidlerTelefon: string
}

export const FormidlerCard: React.FC<FormidlerCardProps> = ({
  tittel,
  formidlerNavn,
  kommune,
  formidlerTelefon,
  stilling,
}) => {
  return (
    <Card>
      <CardTitle level="1" size="medium">
        {tittel}
      </CardTitle>
      <HStack align="center" gap="2" wrap={false}>
        <IconContainer>
          <Personikon />
        </IconContainer>
        <HStack align="center">
          <Tekst>{`${capitalizeName(formidlerNavn)} - ${capitalize(kommune)}`}</Tekst>
          <Tooltip content="Kopier formidler navn" placement="right">
            <CopyButton title="Kopier formidler navn" size="small" copyText={formatName(formidlerNavn)} />
          </Tooltip>
        </HStack>
      </HStack>

      <HStack align="center" gap="2">
        <Ikonplaceholder />
        <HStack align="center">
          <Tekst>{`${capitalize(stilling)}`}</Tekst>
          <Tooltip content="Kopier formidler stilling" placement="right">
            <CopyButton title="Kopier formidler stilling" size="small" copyText={stilling} />
          </Tooltip>
        </HStack>
      </HStack>

      <HStack align="center" gap="2" wrap={false}>
        <IconContainer>
          <TelefonIkon />
        </IconContainer>
        <HStack align="center">
          <Tekst>{formidlerTelefon}</Tekst>
          <Tooltip content="Kopier telefonnummer" placement="right">
            <CopyButton title="Kopier telefonnummer" size="small" copyText={formidlerTelefon} />
          </Tooltip>
        </HStack>
      </HStack>
    </Card>
  )
}

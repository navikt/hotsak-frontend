import React from 'react'
import styled from 'styled-components'

import { BodyShort, BodyLong, Detail, Heading, Label } from '@navikt/ds-react'

const FlytendeTekst = styled(BodyLong)`
  white-space: normal;
  overflow-wrap: break-word;
`

const FlytendeBrytbarTekst = styled(BodyLong)`
  white-space: normal;
  overflow-wrap: anywhere;
`

export const Tekst: React.FC = ({ children }) => <BodyShort size="small">{children}</BodyShort>

export const Brødtekst: React.FC = ({ children }) => <FlytendeTekst size="small">{children}</FlytendeTekst>

export const BrytbarBrødtekst: React.FC = ({ children }) => (
  <FlytendeBrytbarTekst size="small">{children}</FlytendeBrytbarTekst>
)

export const Etikett: React.FC = ({ children }) => <Label size="small">{children}</Label>

export const Undertittel: React.FC = ({ children }) => <Detail size="small">{children}</Detail>

export const Skjermlesertittel: React.FC<{ level?: '1' | '2' | '3' | '4' | '5' | '6' }> = ({ level, children }) => (
  <Heading level={level} className="sr-only" size="medium">
    {children}
  </Heading>
)

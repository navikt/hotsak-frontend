import React from 'react'
import styled from 'styled-components'

import { BodyLong, BodyShort, Detail, Heading, Label } from '@navikt/ds-react'

const FlytendeTekst = styled(BodyLong)`
  white-space: normal;
  overflow-wrap: break-word;
`

const FlytendeBrytbarTekst = styled(BodyLong)`
  white-space: normal;
  overflow-wrap: anywhere;
`

export const Tekst: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BodyShort size="small">{children}</BodyShort>
)

export const TekstMedEllipsis = React.forwardRef<HTMLParagraphElement, { children: React.ReactNode }>(
  ({ children, ...rest }, ref) => (
    <BodyShort ref={ref} size="small" {...rest} truncate>
      {children}
    </BodyShort>
  )
)

export const Brødtekst: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FlytendeTekst size="small">{children}</FlytendeTekst>
)

export const BrytbarBrødtekst: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <FlytendeBrytbarTekst size="small">{children}</FlytendeBrytbarTekst>
)

export const Etikett: React.FC<{ children: React.ReactNode }> = ({ children }) => <Label size="small">{children}</Label>

export const Undertittel: React.FC<{ children: React.ReactNode }> = ({ children }) => <Detail>{children}</Detail>

export const Mellomtittel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <UppercaseHeading level="1" size="small" spacing>
    {children}
  </UppercaseHeading>
)

export const Skjermlesertittel: React.FC<{ level?: '1' | '2' | '3' | '4' | '5' | '6'; children: React.ReactNode }> = ({
  level,
  children,
}) => (
  <Heading level={level} className="sr-only" size="medium">
    {children}
  </Heading>
)

const UppercaseHeading = styled(Heading)`
  color: var(--a-text-subtle);
  font-size: var(--a-font-size-medium);
  text-transform: uppercase;
`

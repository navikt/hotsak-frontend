import { forwardRef, ReactNode } from 'react'
import styled from 'styled-components'

import { BodyLong, BodyShort, BodyShortProps, Detail, Heading, Label } from '@navikt/ds-react'
import { textcontainerBredde } from '../GlobalStyles'

export const TextContainer = styled.div`
  max-width: ${textcontainerBredde};
`

export const Tekst = ({ children, ...rest }: BodyShortProps) => {
  return (
    <BodyShort size="small" {...rest}>
      {children}
    </BodyShort>
  )
}

export const TekstMedEllipsis = forwardRef<HTMLParagraphElement, { children: ReactNode }>(
  ({ children, ...rest }, ref) => (
    <BodyShort ref={ref} size="small" {...rest} truncate>
      {children}
    </BodyShort>
  )
)

export function Brødtekst({ spacing, children }: { spacing?: boolean; children: ReactNode }) {
  return (
    <FlytendeTekst size="small" spacing={spacing}>
      {children}
    </FlytendeTekst>
  )
}

export function BrytbarBrødtekst({ spacing, children }: { spacing?: boolean; children: ReactNode }) {
  return (
    <FlytendeBrytbarTekst size="small" spacing={spacing}>
      {children}
    </FlytendeBrytbarTekst>
  )
}

export function Etikett({ spacing, children }: { spacing?: boolean; children: ReactNode }) {
  return (
    <Label size="small" spacing={spacing}>
      {children}
    </Label>
  )
}

export function Undertittel({ children }: { children: ReactNode }) {
  return <Detail>{children}</Detail>
}

export function Mellomtittel({ children, spacing = true }: { children: ReactNode; spacing?: boolean }) {
  return (
    <UppercaseHeading level="1" size="small" spacing={spacing}>
      {children}
    </UppercaseHeading>
  )
}

export function Skjermlesertittel({
  level,
  children,
}: {
  level?: '1' | '2' | '3' | '4' | '5' | '6'
  children: ReactNode
}) {
  return (
    <Heading level={level} className="sr-only" size="medium">
      {children}
    </Heading>
  )
}

const FlytendeTekst = styled(BodyLong)`
  white-space: normal;
  overflow-wrap: break-word;
`

const FlytendeBrytbarTekst = styled(BodyLong)`
  white-space: normal;
  overflow-wrap: anywhere;
`

const UppercaseHeading = styled(Heading)`
  color: var(--a-text-subtle);
  font-size: var(--a-font-size-medium);
  text-transform: uppercase;
`

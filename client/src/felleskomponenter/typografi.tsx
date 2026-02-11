import { forwardRef, type ReactNode } from 'react'
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

export function BrytbarBrødtekst({ spacing, children }: { spacing?: boolean; children: ReactNode }) {
  return (
    <FlytendeBrytbarTekst size="small" spacing={spacing}>
      {children}
    </FlytendeBrytbarTekst>
  )
}

export function Etikett({
  spacing,
  size = 'small',
  children,
}: {
  spacing?: boolean
  size?: 'small' | 'medium'
  children: ReactNode
}) {
  return (
    <Label spacing={spacing} size={size}>
      {children}
    </Label>
  )
}

export function Undertittel({ children }: { children: ReactNode }) {
  return <Detail>{children}</Detail>
}

export function Mellomtittel({ children, spacing = true }: { children: ReactNode; spacing?: boolean }) {
  return (
    <UppercaseHeading level="1" size="xsmall" spacing={spacing} textColor="subtle">
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

const FlytendeBrytbarTekst = styled(BodyLong)`
  white-space: normal;
  overflow-wrap: anywhere;
`

const UppercaseHeading = styled(Heading)`
  color: var(--ax-text-neutral-subtle);
  font-size: var(--ax-font-size-small);
  text-transform: uppercase;
`

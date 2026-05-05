import { type ReactNode, type Ref } from 'react'

import { BodyLong, BodyShort, BodyShortProps, Detail, Heading, Label } from '@navikt/ds-react'
import classes from './typografi.module.css'

export function TextContainer({ children }: { children: ReactNode }) {
  return <div className={classes.textContainer}>{children}</div>
}

export function Tekst({ children, ...rest }: BodyShortProps) {
  return (
    <BodyShort size="small" {...rest}>
      {children}
    </BodyShort>
  )
}

export function TekstMedEllipsis({ children, ref, ...rest }: { children: ReactNode; ref?: Ref<HTMLParagraphElement> }) {
  return (
    <BodyShort ref={ref} size="small" {...rest} truncate>
      {children}
    </BodyShort>
  )
}

/* Falsk positiv, liker ikke non ascii karakterer i navnet på komponenten (å) */
// eslint-disable-next-line react-refresh/only-export-components
export function BrytbarBrødtekst({ spacing, children }: { spacing?: boolean; children: ReactNode }) {
  return (
    <BodyLong className={classes.flytendeBrytbarTekst} size="small" spacing={spacing}>
      {children}
    </BodyLong>
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
    <Heading level="1" size="xsmall" spacing={spacing} textColor="subtle" className={classes.uppercaseHeading}>
      {children}
    </Heading>
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

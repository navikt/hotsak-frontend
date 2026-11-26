import { BodyShort, Detail, HStack, Tag } from '@navikt/ds-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { Sakstype } from '../types/types.internal'
import { storForbokstavIAlleOrd } from '../utils/formater'
import classes from './Oppgaveetikett.module.css'

export const BehovsmeldingEtikett = ({ variant, label }: { variant: 'alt1' | 'alt2' | 'alt3'; label: string }) => (
  <Tag variant={variant} size="small">
    <BodyShort>{label}</BodyShort>
  </Tag>
)

const SøknadEtikett = () => (
  <Tag className={classes.squareTag} variant="alt1" size="xsmall">
    <Detail>S</Detail>
  </Tag>
)

const BestillingEtikett = () => (
  <Tag className={classes.squareTag} variant="alt2" size="xsmall">
    <Detail>B</Detail>
  </Tag>
)

const TilskuddEtikett = () => (
  <Tag className={classes.squareTag} variant="alt3" size="xsmall">
    <Detail>T</Detail>
  </Tag>
)

interface LabelProps {
  labelLinkTo?: string
  children: ReactNode
}

function Label({ labelLinkTo, children }: LabelProps) {
  if (labelLinkTo) {
    return (
      <Link to={labelLinkTo}>
        <BodyShort size="small">{children}</BodyShort>
      </Link>
    )
  } else {
    return <BodyShort size="small">{children}</BodyShort>
  }
}

function LabelTag({ labelLinkTo, tekst, children }: { labelLinkTo?: string; tekst: string; children?: ReactNode }) {
  return (
    <HStack gap="space-8" wrap={false}>
      {children}
      <Label labelLinkTo={labelLinkTo}>{tekst}</Label>
    </HStack>
  )
}

interface OppgaveetikettProps {
  type: Sakstype
  showLabel?: boolean
  labelLinkTo?: string
}

export function Oppgaveetikett({ type, showLabel = false, labelLinkTo }: OppgaveetikettProps) {
  switch (type) {
    case Sakstype.SØKNAD:
      return showLabel ? (
        <LabelTag labelLinkTo={labelLinkTo} tekst={storForbokstavIAlleOrd(type)}>
          <SøknadEtikett aria-hidden />
        </LabelTag>
      ) : (
        <SøknadEtikett />
      )
    case Sakstype.BESTILLING:
      return showLabel ? (
        <LabelTag labelLinkTo={labelLinkTo} tekst={storForbokstavIAlleOrd(type)}>
          <BestillingEtikett aria-hidden />
        </LabelTag>
      ) : (
        <BestillingEtikett aria-hidden />
      )
    case Sakstype.BARNEBRILLER:
      return showLabel ? (
        <LabelTag labelLinkTo={labelLinkTo} tekst="Tilskudd">
          <TilskuddEtikett aria-hidden />
        </LabelTag>
      ) : (
        <TilskuddEtikett aria-hidden />
      )
    default:
      return null
  }
}

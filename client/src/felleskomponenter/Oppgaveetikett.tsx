import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BodyShort, Detail, HStack, Tag } from '@navikt/ds-react'
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

function LabelTag({ labelLinkTo, type, children }: { labelLinkTo?: string; type: Sakstype; children?: ReactNode }) {
  return (
    <HStack gap="space-8" wrap={false}>
      {children}
      <Label labelLinkTo={labelLinkTo}>{storForbokstavIAlleOrd(type)}</Label>
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
        <LabelTag labelLinkTo={labelLinkTo} type={type}>
          <SøknadEtikett aria-hidden />
        </LabelTag>
      ) : (
        <SøknadEtikett />
      )
    case Sakstype.BESTILLING:
      return showLabel ? (
        <LabelTag labelLinkTo={labelLinkTo} type={type}>
          <BestillingEtikett aria-hidden />
        </LabelTag>
      ) : (
        <BestillingEtikett aria-hidden />
      )
    case Sakstype.TILSKUDD:
      return showLabel ? (
        <LabelTag labelLinkTo={labelLinkTo} type={type}>
          <TilskuddEtikett aria-hidden />
        </LabelTag>
      ) : (
        <TilskuddEtikett aria-hidden />
      )
    default:
      return null
  }
}

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BodyShort, Detail, HStack, Tag } from '@navikt/ds-react'
import { Sakstype } from '../types/types.internal'
import { storForbokstavIAlleOrd } from '../utils/formater'
import styled from 'styled-components'

export const BehovsmeldingEtikett = ({ variant, label }: { variant: 'alt1' | 'alt2' | 'alt3'; label: string }) => (
  <Tag variant={variant} size="small">
    <BodyShort>{label}</BodyShort>
  </Tag>
)

const SøknadEtikett = () => (
  <SquareTag variant="alt1" size="xsmall">
    <Detail>S</Detail>
  </SquareTag>
)

const BestillingEtikett = () => (
  <SquareTag variant="alt2" size="xsmall">
    <Detail>B</Detail>
  </SquareTag>
)

const TilskuddEtikett = () => (
  <SquareTag variant="alt3" size="xsmall">
    <Detail>T</Detail>
  </SquareTag>
)

const SquareTag = styled(Tag)`
  padding-left: 6px;
  padding-right: 6px;
  padding-top: 0px;
  padding-bottom: 0px;
`

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
    <HStack gap="space-8">
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

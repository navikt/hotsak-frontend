import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { BodyShort } from '@navikt/ds-react'

import { storForbokstavIAlleOrd } from '../utils/formater'
import { Sakstype } from '../types/types.internal'

interface EtikettProps {
  størrelse?: 's' | 'l'
}

const Etikett = styled.div<{ $størrelse?: 's' | 'l' }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  text-align: center;
  padding: 0.5rem;
  font-weight: 600;
  border-radius: 0.25rem;
  pointer-events: none;

  width: ${(props) => (props.$størrelse === 'l' ? '20px' : '16px')};
  height: ${(props) => (props.$størrelse === 'l' ? '20px' : '16px')};
  font-size: ${(props) => (props.$størrelse === 'l' ? '14px' : '12px')};
`

const SøknadEtikett = styled(Etikett)`
  background: var(--a-purple-100);
  border: 1px solid var(--a-purple-500);

  &:before {
    content: 'S';
  }
`

const LabelContainer = styled(BodyShort)`
  margin-left: 0.5rem;
`

const BestillingEtikett = styled(Etikett)`
  background: var(--a-green-100);
  border: 1px solid var(--a-green-500);

  &:before {
    content: 'B';
  }
`

const TilskuddEtikett = styled(Etikett)`
  background: var(--a-blue-100);
  border: 1px solid var(--a-blue-500);

  &:before {
    content: 'T';
  }
`

interface LabelProps {
  labelLinkTo?: string
  children: ReactNode
}

function Label({ labelLinkTo, children }: LabelProps) {
  if (labelLinkTo) {
    return (
      <Link to={labelLinkTo}>
        <LabelContainer size="small">{children}</LabelContainer>
      </Link>
    )
  } else {
    return <LabelContainer size="small">{children}</LabelContainer>
  }
}

interface OppgaveetikettProps extends EtikettProps {
  type: Sakstype
  showLabel?: boolean
  labelLinkTo?: string
}

export function Oppgaveetikett({ type, størrelse = 'l', showLabel = false, labelLinkTo }: OppgaveetikettProps) {
  switch (type) {
    case Sakstype.SØKNAD:
      return showLabel ? (
        <>
          <SøknadEtikett $størrelse={størrelse} aria-hidden />
          <Label labelLinkTo={labelLinkTo}>{storForbokstavIAlleOrd(type)}</Label>
        </>
      ) : (
        <SøknadEtikett $størrelse={størrelse} />
      )
    case Sakstype.BESTILLING:
      return showLabel ? (
        <>
          <BestillingEtikett $størrelse={størrelse} aria-hidden />
          <Label labelLinkTo={labelLinkTo}>{storForbokstavIAlleOrd(type)}</Label>
        </>
      ) : (
        <BestillingEtikett $størrelse={størrelse} aria-hidden />
      )
    case Sakstype.TILSKUDD:
      return showLabel ? (
        <>
          <TilskuddEtikett $størrelse={størrelse} aria-hidden />
          <Label labelLinkTo={labelLinkTo}>{storForbokstavIAlleOrd(type)}</Label>
        </>
      ) : (
        <TilskuddEtikett $størrelse={størrelse} aria-hidden />
      )
    default:
      return null
  }
}

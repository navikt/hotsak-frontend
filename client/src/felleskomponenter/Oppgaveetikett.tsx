import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { capitalize } from '../utils/stringFormating'

import { Oppgavetype } from '../types/types.internal'

interface EtikettProps {
  størrelse?: 's' | 'l'
}

const Etikett = styled.div<EtikettProps>`
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

  width: ${(props) => (props.størrelse === 'l' ? '20px' : '16px')};
  height: ${(props) => (props.størrelse === 'l' ? '20px' : '16px')};
  font-size: ${(props) => (props.størrelse === 'l' ? '14px' : '12px')};
`

const SøknadEtikett = styled(Etikett)`
  background: var(--navds-global-color-purple-100);
  border: 1px solid var(--navds-global-color-purple-500);

  :before {
    content: 'S';
  }
`

const LabelContainer = styled.div`
  margin-left: 0.5rem;
`

const BestillingEtikett = styled(Etikett)`
  background: var(--navds-global-color-green-100);
  border: 1px solid var(--navds-global-color-green-500);

  :before {
    content: 'B';
  }
`

interface OppgaveetikettProps extends EtikettProps {
  type: Oppgavetype
  showLabel?: boolean
  labelLinkTo?: string
}

interface LabelProps {
  labelLinkTo?: string
}

const Label: React.FC<LabelProps> = ({ labelLinkTo, children }) => {
  if (labelLinkTo) {
    return (
      <Link to={labelLinkTo}>
        <LabelContainer>{children}</LabelContainer>
      </Link>
    )
  } else {
    return <LabelContainer>{children}</LabelContainer>
  }
}

export const Oppgaveetikett: React.VFC<OppgaveetikettProps> = ({
  type,
  størrelse = 'l',
  showLabel = false,
  labelLinkTo,
}) => {
  switch (type) {
    case Oppgavetype.SØKNAD:
      return showLabel ? (
        <>
          <SøknadEtikett størrelse={størrelse} aria-hidden />
          <Label labelLinkTo={labelLinkTo}>{capitalize(type)}</Label>
        </>
      ) : (
        <SøknadEtikett størrelse={størrelse} />
      )
    case Oppgavetype.BESTILLING:
      return showLabel ? (
        <>
          <BestillingEtikett størrelse={størrelse} aria-hidden />
          <Label labelLinkTo={labelLinkTo}>{capitalize(type)}</Label>
        </>
      ) : (
        <BestillingEtikett størrelse={størrelse} aria-hidden />
      )
    default:
      return null
  }
}

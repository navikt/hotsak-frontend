import React from 'react'
import styled from 'styled-components/macro'

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

  width: ${(props) => (props.størrelse === 'l' ? '20px' : '16px')};
  height: ${(props) => (props.størrelse === 'l' ? '20px' : '16px')};
  font-size: ${(props) => (props.størrelse === 'l' ? '14px' : '12px')};

  :before {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

const SøknadEtikett = styled(Etikett)`
  background: var(--navds-global-color-purple-100);
  border: 1px solid var(--navds-global-color-purple-500);

  :before {
    content: 'S';
  }
`

const Label = styled.div`
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
}

export const Oppgaveetikett: React.VFC<OppgaveetikettProps> = ({ type, størrelse = 'l', showLabel = false }) => {
  switch (type) {
    case Oppgavetype.SØKNAD:
      return showLabel ? (
        <>
          <SøknadEtikett størrelse={størrelse} />
          <Label>{capitalize(type)}</Label>
        </>
      ) : (
        <SøknadEtikett størrelse={størrelse} />
      )
    case Oppgavetype.BESTILLING:
      return showLabel ? (
        <>
          <BestillingEtikett størrelse={størrelse} />
          <Label>{capitalize(type)}</Label>
        </>
      ) : (
        <BestillingEtikett størrelse={størrelse} />
      )
    default:
      return null
  }
}

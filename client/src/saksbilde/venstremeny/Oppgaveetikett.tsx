import styled from 'styled-components/macro'
import { Oppgavetype } from '../../types/types.internal'

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
  background: var(--speil-etikett-forstegangs-background);
  border: 1px solid var(--speil-etikett-forstegangs-border);

  :before {
    content: 'S';
  }
`

interface OppgaveetikettProps extends EtikettProps {
  type: Oppgavetype
}

export const Oppgaveetikett = ({ type, størrelse = 'l' }: OppgaveetikettProps) => {
  switch (type) {
    case Oppgavetype.Søknad:
      return <SøknadEtikett størrelse={størrelse} />
    default:
      return null
  }
}

import styled from 'styled-components'

export const Merknad = styled.div`
  position: relative;

  &:before {
    content: '';
    position: absolute;
    background-color: var(--a-border-info);
    width: 3px;
    height: 95%;
    bottom: 0;
    left: -1rem;
  }
`

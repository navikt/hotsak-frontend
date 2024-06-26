import styled from 'styled-components'

export const Fremhevet = styled.div`
  padding: 0.25rem 0;
  position: relative;

  &:before {
    content: '';
    position: absolute;
    background-color: var(--a-border-info);
    width: 0.1875rem;
    height: 95%;
    bottom: 0;
    left: -1rem;
  }
`

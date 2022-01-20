
import styled from 'styled-components/macro'

export const Merknad = styled.div`
position: relative;

&:before {
    content:'';
    position: absolute;
    background-color: var(--navds-semantic-color-feedback-info-border);
    width: 3px;
    height: 95%;
    bottom: 0;
    left:-1rem; 
  }
`

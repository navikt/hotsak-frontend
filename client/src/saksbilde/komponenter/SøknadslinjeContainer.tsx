import styled from 'styled-components'

import { søknadslinjeHøyde } from '../../GlobalStyles'

export const SøknadslinjeContainer = styled.nav`
  height: ${søknadslinjeHøyde};

  > div:last-of-type {
    margin-left: 1rem;
  }
`

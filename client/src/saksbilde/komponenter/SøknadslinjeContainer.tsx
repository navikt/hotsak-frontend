import styled from 'styled-components'

import { hotsakTotalMinWidth } from '../../GlobalStyles'

export const SøknadslinjeContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  height: 48px;
  box-sizing: border-box;
  border-bottom: 1px solid var(--a-border-default);
  padding: 0 0 0 2rem;
  min-width: ${hotsakTotalMinWidth};

  > div:last-of-type {
    margin-left: 1rem;
  }
`

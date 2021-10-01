import styled from 'styled-components/macro'

import { UndertekstBold } from 'nav-frontend-typografi'

export const CardTitle = styled(UndertekstBold)`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  letter-spacing: 0.4px;
  color: #59514b;

  a {
    color: inherit;

    &:hover {
      text-decoration: none;
    }

    &:active,
    &:focus {
      outline: none;
      color: var(--navds-color-text-inverse);
      text-decoration: none;
      background-color: var(--navds-text-focus);
      box-shadow: 0 0 0 2px var(--navds-text-focus);
    }
  }
`

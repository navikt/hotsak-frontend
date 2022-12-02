import styled from 'styled-components'

import { BodyLong } from '@navikt/ds-react'

export const TekstMedEllipsis = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  > a:focus {
    box-shadow: 0 0 0 3px var(--a-border-focus);
  }
`

export const BodyLongMedEllipsis = styled(BodyLong)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  > a:focus {
    box-shadow: 0 0 0 3px var(--a-border-focus);
  }
`

import { BodyLong } from '@navikt/ds-react'
import styled from 'styled-components/macro'

export const TekstMedEllipsis = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  > a:focus {
    box-shadow: 0 0 0 3px var(--navds-semantic-color-focus);
  }
`


export const BodyLongMedEllipsis = styled(BodyLong)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  > a:focus {
    box-shadow: 0 0 0 3px var(--navds-semantic-color-focus);
  }
`

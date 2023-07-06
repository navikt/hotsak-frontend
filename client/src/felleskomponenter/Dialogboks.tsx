import styled from 'styled-components'

import { Modal } from '@navikt/ds-react'

type DialogboksProps = {
  width?: string
  height?: string
}

export const DialogBoks = styled(Modal)<DialogboksProps>`
  width: ${(props) => props.width || '745px'};
  height: ${(props) => props.height || 'auto'};
  padding-right: 1rem;
  padding-left: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
`

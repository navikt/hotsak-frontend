import { HGrid } from '@navikt/ds-react'
import styled from 'styled-components'
import { headerHøydeRem } from '../../GlobalStyles'

export const Saksinnhold = styled(HGrid)`
  height: calc(100% - ${headerHøydeRem}rem);
`

export const Content = styled.section`
  padding: 0 1.4rem;
  padding-top: 1rem;
  height: 100%;
  box-sizing: border-box;
`
export const Hovedinnhold = styled(HGrid)`
  height: 100%;
`

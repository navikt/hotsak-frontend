import { HGrid } from '@navikt/ds-react'
import styled from 'styled-components'
import { headerHøydeRem } from '../../GlobalStyles'

export const Saksinnhold = styled(HGrid)`
  height: calc(100% - ${headerHøydeRem}rem);
`

export const Hovedinnhold = styled(HGrid)`
  height: 100%;
`

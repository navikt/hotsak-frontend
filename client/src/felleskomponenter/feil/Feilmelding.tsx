import type { ReactNode } from 'react'
import styled from 'styled-components'

import { Alert } from '@navikt/ds-react'

import { Tekst } from '../typografi'

const FeilmeldingAlert = styled(Alert)`
  width: max-content;
  margin: 2rem;
  padding: 0.5rem;
`

export function Feilmelding({ children }: { children: ReactNode }) {
  return (
    <FeilmeldingAlert size="small" variant="error">
      <Tekst>{children}</Tekst>
    </FeilmeldingAlert>
  )
}

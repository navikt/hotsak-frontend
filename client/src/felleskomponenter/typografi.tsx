
import { BodyShort } from '@navikt/ds-react'
import styled from 'styled-components/macro'

export const Tekst: React.FC = ({ children }) => {
    return <BodyShort size="s">{children}</BodyShort>
  }

export const Etikett = styled(Tekst)`
  font-weight: bold;
`

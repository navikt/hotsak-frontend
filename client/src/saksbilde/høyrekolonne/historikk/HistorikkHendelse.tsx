import styled from 'styled-components'

import { formaterTidsstempel } from '../../../utils/dato'
import { Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi'
import { Hendelse } from '../../../types/types.internal'

export function HistorikkHendelse({ hendelse, detaljer, opprettet, bruker }: Hendelse) {
  return (
    <Li>
      <Etikett>{hendelse}</Etikett>
      {opprettet && <Undertittel>{formaterTidsstempel(opprettet)}</Undertittel>}
      {detaljer?.split(';').map((detalj) => <Tekst key={detalj}>{detalj}</Tekst>)}
      <Tekst>{bruker}</Tekst>
    </Li>
  )
}

const Li = styled.li`
  &:not(:last-of-type) {
    padding-bottom: var(--a-spacing-3);
    border-bottom: 1px solid var(--a-border-subtle);
  }
`

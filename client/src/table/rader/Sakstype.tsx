import React from 'react'

import { Normaltekst } from 'nav-frontend-typografi'

import { Flex } from '../../Flex'
import { Periodetype } from '../../types/types.internal'
//import { Oppgaveetikett } from '../../../../components/Oppgaveetikett';
import { CellContent } from './CellContent'

const getLabelForType = (type: Periodetype) => {
  switch (type) {
    case Periodetype.Forlengelse:
    case Periodetype.Infotrygdforlengelse:
      return 'Forlengelse'
    case Periodetype.Førstegangsbehandling:
      return 'Førstegang.'
    case Periodetype.OvergangFraInfotrygd:
      return 'Forlengelse IT'
    case Periodetype.Stikkprøve:
      return 'Stikkprøve'
    case Periodetype.RiskQa:
      return 'Risk QA'
    case Periodetype.Revurdering:
      return 'Revurdering'
  }
}

interface SakstypeProps {
  type: Periodetype
}

export const Sakstype = React.memo(({ type }: SakstypeProps) => (
  <CellContent width={128}>
    <Flex alignItems="center">
      {/*<Oppgaveetikett type={type} />*/}
      <div>Oppgaveetikett</div>
      <Normaltekst style={{ marginLeft: '12px' }}>{getLabelForType(type)}</Normaltekst>
    </Flex>
  </CellContent>
))

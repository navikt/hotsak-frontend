import React from 'react'
import styled from 'styled-components/macro'

import { hotsakHistorikkWidth } from '../../GlobalStyles'
import { HøyrekolonneTabs, Oppgavetype } from '../../types/types.internal'
import { Historikk } from './historikk/Historikk'
import { Hjelpemiddeloversikt } from './hjelpemiddeloversikt/Hjelpemiddeloversikt'

interface HøyrekolonneProps {
  currentTab: HøyrekolonneTabs
  oppgavetype: Oppgavetype
}

export const KolonneOppsett = styled.ul`
  width: ${hotsakHistorikkWidth};
  min-width: ${hotsakHistorikkWidth};
  max-width: ${hotsakHistorikkWidth};
  flex: 1;
  flex-shrink: 0;
  padding: 0 24px;
  box-sizing: border-box;
  border-left: 1px solid var(--navds-semantic-color-border-muted);
`

export const KolonneTittel = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 14px;
`

export const Høyrekolonne: React.VFC<HøyrekolonneProps> = ({ currentTab, oppgavetype }) => {
  switch (currentTab) {
    case HøyrekolonneTabs.SAKSHISTORIKK:
      return <Historikk />
    case HøyrekolonneTabs.HJELPEMIDDELOVERSIKT:
      return <Hjelpemiddeloversikt />
  }
}

import { HøyrekolonneTabs } from '../../types/types.internal'
import styled from 'styled-components/macro'
import { Historikk } from './historikk/Historikk'
import { Hjelpemiddeloversikt } from './hjelpemiddeloversikt/Hjelpemiddeloversikt'

interface HøyrekolonneProps {
  currentTab: HøyrekolonneTabs
}

export const KolonneOppsett = styled.ul`
  width: var(--speil-historikk-width);
  min-width: var(--speil-historikk-width);
  max-width: var(--speil-historikk-width);
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

export const Høyrekolonne = ({ currentTab }: HøyrekolonneProps) => {

  switch (currentTab) {
    case HøyrekolonneTabs.SAKSHISTORIKK:
      return <Historikk />
    case HøyrekolonneTabs.HJELPEMIDDELOVERSIKT:
      return <Hjelpemiddeloversikt />
  }
}

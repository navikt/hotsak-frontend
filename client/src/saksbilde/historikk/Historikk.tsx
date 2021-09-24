import styled from 'styled-components/macro'
import { sorterKronologisk } from '../../utils/date'
import { useHistorikk } from '../historikkHook'
import { HistorikkHendelse } from './HistorikkHendelse'
const HistorikkTitle = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 14px;
`

const Hendelser = styled.ul`
  width: var(--speil-historikk-width);
  min-width: var(--speil-historikk-width);
  max-width: var(--speil-historikk-width);
  flex: 1;
  flex-shrink: 0;
  padding: 0 24px;
  box-sizing: border-box;
  border-left: 1px solid var(--navds-color-border);
`

export const Historikk: React.FC = ({ children }) => {
  const { hendelser, isError, isLoading } = useHistorikk()

  if (isError) {
    return <div>Feil ved henting av historikk</div>
  }

  if (isLoading) {
    return <div>Henter sakshistorikk</div>
  }

  return (
    <Hendelser>
      <HistorikkTitle>HISTORIKK</HistorikkTitle>
      {hendelser
        .sort((a, b) => sorterKronologisk(a.timestamp, b.timestamp))
        .map((it) => (
          <HistorikkHendelse key={it.id} {...it} />
        ))}
    </Hendelser>
  )
}

import { sorterKronologisk } from '../../../utils/date'

import { useHistorikk } from './historikkHook'
import { HistorikkHendelse } from './HistorikkHendelse'
import { KolonneOppsett, KolonneTittel } from '../Høyrekolonne'

export const Historikk: React.FC = ({ children }) => {
  const { hendelser, isError, isLoading } = useHistorikk()

  if (isError) {
    return <div>Feil ved henting av historikk</div>
  }

  if (isLoading) {
    return <div>Henter sakshistorikk</div>
  }

  if (!hendelser) {
    return <div>Ingen hendelser</div>
  }

  return (
    <KolonneOppsett>
      <KolonneTittel>HISTORIKK</KolonneTittel>
      {hendelser
        .sort((a, b) => sorterKronologisk(a.opprettet, b.opprettet))
        .map((it) => (
          <HistorikkHendelse key={it.id} {...it} />
        ))}
    </KolonneOppsett>
  )
}

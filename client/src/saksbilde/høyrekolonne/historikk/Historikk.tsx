import { sorterKronologisk } from '../../../utils/dato'
import { KolonneOppsett, KolonneTittel } from '../Høyrekolonne'
import { HistorikkHendelse } from './HistorikkHendelse'
import { useHistorikk } from './useHistorikk'

export function Historikk() {
  const { hendelser, isError, isLoading } = useHistorikk()

  if (isError) {
    return <div>Feil ved henting av historikk</div>
  }

  if (isLoading) {
    return <div>Henter historikk</div>
  }

  if (!hendelser) {
    return (
      <KolonneOppsett>
        <KolonneTittel>Historikk</KolonneTittel>
        <div>Ingen hendelser</div>
      </KolonneOppsett>
    )
  }

  return (
    <KolonneOppsett>
      <KolonneTittel>Historikk</KolonneTittel>
      {hendelser
        .sort((a, b) => sorterKronologisk(a.opprettet, b.opprettet))
        .map((it) => (
          <HistorikkHendelse key={it.id} {...it} />
        ))}
    </KolonneOppsett>
  )
}

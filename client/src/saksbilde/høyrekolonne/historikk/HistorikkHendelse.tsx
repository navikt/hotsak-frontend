import { Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi'
import { Hendelse } from '../../../types/types.internal'
import { formaterTidsstempel } from '../../../utils/dato'
import { HøyrekolonneInnslag } from '../HøyrekolonneInnslag.tsx'

export function HistorikkHendelse({ hendelse, detaljer, opprettet, bruker }: Hendelse) {
  return (
    <HøyrekolonneInnslag>
      <Etikett>{hendelse}</Etikett>
      {opprettet && <Undertittel>{formaterTidsstempel(opprettet)}</Undertittel>}
      {detaljer?.split(';').map((detalj) => <Tekst key={detalj}>{detalj}</Tekst>)}
      <Tekst>{bruker}</Tekst>
    </HøyrekolonneInnslag>
  )
}

import { Link } from '@navikt/ds-react'
import { Etikett, Tekst, Undertittel } from '../../../felleskomponenter/typografi'
import { Hendelse } from '../../../types/types.internal'
import { formaterTidsstempel } from '../../../utils/dato'
import { HøyrekolonneInnslag } from '../HøyrekolonneInnslag.tsx'

export function HistorikkHendelse({ hendelse, detaljer, opprettet, bruker, lenke }: Hendelse) {
  return (
    <HøyrekolonneInnslag>
      <Etikett>{hendelse}</Etikett>
      {opprettet && <Undertittel>{formaterTidsstempel(opprettet)}</Undertittel>}
      {lenke && (
        <>
          <Link href={lenke.lenke} target="_blank">
            {lenke.tittel}
          </Link>
        </>
      )}
      {detaljer?.split(';').map((detalj) => (
        <Tekst key={detalj}>{detalj}</Tekst>
      ))}
      <Tekst>{bruker}</Tekst>
    </HøyrekolonneInnslag>
  )
}

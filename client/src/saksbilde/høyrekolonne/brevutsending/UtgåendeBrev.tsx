import { memo } from 'react'

import { Tekst } from '../../../felleskomponenter/typografi.tsx'
import { Brevkode } from '../../../types/types.internal'
import { useSortering } from '../../../utils/useSortering.ts'
import { useSaksdokumenter } from '../../barnebriller/useSaksdokumenter'
import { HøyrekolonnePanel } from '../HøyrekolonnePanel.tsx'
import { BrevKort } from './BrevKort'
import { sorterKronologiskStigende } from '../../../utils/dato.ts'

export interface UtgåendeBrevProps {
  sakId: string
}

export const UtgåendeBrev = memo((props: UtgåendeBrevProps) => {
  const { sakId } = props
  const { data, error, isLoading } = useSaksdokumenter(sakId)
  const saksdokumenter = useSortering(
    data.filter((dokument) => dokument.brevkode === Brevkode.INNHENTE_OPPLYSNINGER_BARNEBRILLER),
    'opprettet',
    sorterKronologiskStigende
  )
  return (
    <HøyrekolonnePanel
      tittel="Utgående brev"
      error={error && 'Feil ved henting av brev'}
      loading={isLoading && 'Henter brev...'}
    >
      {saksdokumenter.length > 0 ? (
        saksdokumenter.map((saksdokument) => <BrevKort key={saksdokument.dokumentId} {...saksdokument} />)
      ) : (
        <Tekst>Ingen brev sendt.</Tekst>
      )}
    </HøyrekolonnePanel>
  )
})

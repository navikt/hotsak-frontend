import { VStack } from '@navikt/ds-react'

import { Tekst } from '../../felleskomponenter/typografi'
import { HistorikkHendelse } from '../høyrekolonne/historikk/HistorikkHendelse'
import { useSakshistorikk } from '../høyrekolonne/historikk/useSakshistorikk'
import { HøyrekolonnePanel } from '../høyrekolonne/HøyrekolonnePanel'
import { ListeUtenPunkt } from '../../felleskomponenter/Liste'

export function BarnebrillesakHistorikk() {
  const { hendelser, error, isLoading } = useSakshistorikk()
  return (
    <HøyrekolonnePanel
      tittel="Historikk"
      error={error && 'Feil ved henting av historikk.'}
      loading={isLoading && 'Henter historikk...'}
    >
      {hendelser.length > 0 ? (
        <VStack as={ListeUtenPunkt} gap="3">
          {hendelser.map((it) => (
            <HistorikkHendelse key={it.id} {...it} />
          ))}
        </VStack>
      ) : (
        <Tekst>Ingen hendelser.</Tekst>
      )}
    </HøyrekolonnePanel>
  )
}

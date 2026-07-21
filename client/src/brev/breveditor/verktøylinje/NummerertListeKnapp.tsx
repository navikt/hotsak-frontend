import { NumberListIcon } from '@navikt/aksel-icons'
import { ListeKnapp } from './hjelpere/ListeKnapp/ListeKnapp'

export function NummerertListeKnapp() {
  return <ListeKnapp tittel="Nummerert liste" listeStilType="ol" ikon={<NumberListIcon fontSize="1rem" />} />
}

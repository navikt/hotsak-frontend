import { NumberListIcon } from '@navikt/aksel-icons'
import ListeKnapp from './hjelpere/ListeKnapp/ListeKnapp.tsx'

const NummerertListeKnapp = () => {
  return <ListeKnapp tittel="Nummerert liste" listeStilType="ol" ikon={<NumberListIcon fontSize="1rem" />} />
}

export default NummerertListeKnapp

import { BulletListIcon } from '@navikt/aksel-icons'
import ListeKnapp from './hjelpere/ListeKnapp.tsx'

const PunktlisteKnapp = () => {
  return <ListeKnapp tittel="Punktliste" listeStilType="ul" ikon={<BulletListIcon fontSize="1rem" />} />
}

export default PunktlisteKnapp

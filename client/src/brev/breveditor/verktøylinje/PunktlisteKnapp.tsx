import { BulletListIcon } from '@navikt/aksel-icons'
import { ListeKnapp } from './hjelpere/ListeKnapp/ListeKnapp'

export function PunktlisteKnapp() {
  return <ListeKnapp tittel="Punktliste" listeStilType="ul" ikon={<BulletListIcon fontSize="1rem" />} />
}

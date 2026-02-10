import { Tekst } from '../../../../felleskomponenter/typografi'
import { storForbokstavIOrd } from '../../../../utils/formater'
import { EndretArtikkel, EndretArtikkelBegrunnelse } from '../../../sakTypes'

export function EndretTilbehørBegrunnelse({ endretTilbehør }: { endretTilbehør: EndretArtikkel }) {
  if (
    endretTilbehør?.begrunnelse === EndretArtikkelBegrunnelse.ANNET ||
    endretTilbehør?.begrunnelse === EndretArtikkelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
  ) {
    return <Tekst>{endretTilbehør.begrunnelseFritekst}</Tekst>
  }

  const begrunnelse = EndretArtikkelBegrunnelse[endretTilbehør.begrunnelse] || endretTilbehør.begrunnelse
  return <Tekst>{storForbokstavIOrd(begrunnelse)}</Tekst>
}

import { List } from '@navikt/ds-react'
import { Opplysning } from '../../types/BehovsmeldingTypes'
import { Brødtekst, Etikett } from '../../felleskomponenter/typografi'
import { storForbokstavIOrd } from '../../utils/formater'
import { ListItem } from '@navikt/ds-react/List'

export function Opplysninger({ opplysninger }: { opplysninger: Opplysning[] }) {
  return opplysninger.map((opplysning) => {
    return (
      <List size="small" key={opplysning.ledetekst.nb}>
        <Etikett>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}`}</Etikett>
        {opplysning.innhold.map((element, idx) => (
          <ListItem key={idx}>
            <Brødtekst>{element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}</Brødtekst>
          </ListItem>
        ))}
      </List>
    )
  })
}

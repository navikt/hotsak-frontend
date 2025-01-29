import { Box } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../felleskomponenter/typografi'
import { Opplysning } from '../../types/BehovsmeldingTypes'
import { storForbokstavIOrd } from '../../utils/formater'

export function Opplysninger({ opplysninger }: { opplysninger: Opplysning[] }) {
  return opplysninger.map((opplysning) => {
    return (
      <Box key={opplysning.ledetekst.nb}>
        <Etikett>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}`}</Etikett>
        <ul key={opplysning.ledetekst.nb} style={{ margin: '0' }}>
          {opplysning.innhold.map((element, idx) => (
            <li key={idx}>
              <Brødtekst>
                {element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}
              </Brødtekst>
            </li>
          ))}
        </ul>
      </Box>
    )
  })
}

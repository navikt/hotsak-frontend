import { VStack } from '@navikt/ds-react'
import { Etikett, Tekst, TextContainer } from '../../felleskomponenter/typografi'
import { Opplysning } from '../../types/BehovsmeldingTypes'
import { storForbokstavIOrd } from '../../utils/formater'

export function Opplysninger({ opplysninger }: { opplysninger: Opplysning[] }) {
  return (
    <VStack gap="space-8">
      {opplysninger.map((opplysning) => {
        return (
          <TextContainer key={opplysning.ledetekst.nb}>
            <Etikett>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}`}</Etikett>
            {opplysning.innhold.length === 1 ? (
              <Tekst>
                {opplysning.innhold[0].forhåndsdefinertTekst
                  ? opplysning.innhold[0].forhåndsdefinertTekst.nb
                  : opplysning.innhold[0].fritekst}
              </Tekst>
            ) : (
              <ul key={opplysning.ledetekst.nb} style={{ margin: '0' }}>
                {opplysning.innhold.map((element, idx) => (
                  <li key={idx}>
                    <Tekst>{element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}</Tekst>
                  </li>
                ))}
              </ul>
            )}
          </TextContainer>
        )
      })}
    </VStack>
  )
}

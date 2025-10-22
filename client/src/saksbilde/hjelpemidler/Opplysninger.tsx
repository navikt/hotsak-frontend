import { Box, VStack } from '@navikt/ds-react'
import { BrytbarBrødtekst, Etikett } from '../../felleskomponenter/typografi'
import { Opplysning } from '../../types/BehovsmeldingTypes'
import { storForbokstavIOrd } from '../../utils/formater'

export function Opplysninger({ opplysninger }: { opplysninger: Opplysning[] }) {
  return (
    <VStack gap="space-8">
      {opplysninger.map((opplysning) => {
        return (
          <Box key={opplysning.ledetekst.nb}>
            <Etikett>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}`}</Etikett>
            {opplysning.innhold.length === 1 ? (
              <BrytbarBrødtekst>
                {opplysning.innhold[0].forhåndsdefinertTekst
                  ? opplysning.innhold[0].forhåndsdefinertTekst.nb
                  : opplysning.innhold[0].fritekst}
              </BrytbarBrødtekst>
            ) : (
              <ul key={opplysning.ledetekst.nb} style={{ margin: '0' }}>
                {opplysning.innhold.map((element, idx) => (
                  <li key={idx}>
                    <BrytbarBrødtekst>
                      {element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}
                    </BrytbarBrødtekst>
                  </li>
                ))}
              </ul>
            )}
          </Box>
        )
      })}
    </VStack>
  )
}

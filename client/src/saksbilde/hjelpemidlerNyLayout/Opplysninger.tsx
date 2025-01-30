import { Box, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../felleskomponenter/typografi'
import { Opplysning } from '../../types/BehovsmeldingTypes'
import { storForbokstavIOrd } from '../../utils/formater'

export function Opplysninger({ opplysninger }: { opplysninger: Opplysning[] }) {
  return (
    <VStack gap="3">
      {opplysninger.map((opplysning) => {
        return (
          <Box key={opplysning.ledetekst.nb}>
            <Etikett>{`${storForbokstavIOrd(opplysning.ledetekst.nb)}`}</Etikett>
            {opplysning.innhold.length === 1 ? (
              <>
                <Brødtekst>
                  {opplysning.innhold[0].forhåndsdefinertTekst
                    ? opplysning.innhold[0].forhåndsdefinertTekst.nb
                    : opplysning.innhold[0].fritekst}
                </Brødtekst>
              </>
            ) : (
              <ul key={opplysning.ledetekst.nb} style={{ margin: '0' }}>
                {opplysning.innhold.map((element, idx) => (
                  <li key={idx}>
                    <Brødtekst>
                      {element.forhåndsdefinertTekst ? element.forhåndsdefinertTekst.nb : element.fritekst}
                    </Brødtekst>
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

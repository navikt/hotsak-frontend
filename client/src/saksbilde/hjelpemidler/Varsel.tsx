import { ExclamationmarkTriangleFillIcon, InformationSquareFillIcon } from '@navikt/aksel-icons'
import { HStack, VStack } from '@navikt/ds-react'
import { Brødtekst, TextContainer } from '../../felleskomponenter/typografi'
import { Varsel, Varseltype } from '../../types/BehovsmeldingTypes'

export function Varsler({ varsler }: { varsler?: Varsel[] }) {
  if (!varsler || varsler.length === 0) {
    return null
  }
  return (
    <VStack gap="space-6">
      {varsler.map((varsel) => {
        return (
          <HStack gap="space-8" key={varsel.tekst.nb} wrap={false}>
            <div>
              {varsel.type === Varseltype.WARNING ? (
                <ExclamationmarkTriangleFillIcon color="var(--ax-text-warning-decoration)" fontSize="1.25rem" />
              ) : (
                <InformationSquareFillIcon color="var(--ax-text-info-decoration)" fontSize="1.25rem" />
              )}
            </div>
            <TextContainer>
              <Brødtekst>{varsel.tekst.nb}</Brødtekst>
            </TextContainer>
          </HStack>
        )
      })}
    </VStack>
  )
}

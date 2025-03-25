import { ExclamationmarkTriangleFillIcon, InformationSquareFillIcon } from '@navikt/aksel-icons'
import { HStack, VStack } from '@navikt/ds-react'
import { Brødtekst } from '../../felleskomponenter/typografi'
import { Varsel, Varseltype } from '../../types/BehovsmeldingTypes'

export function Varsler({ varsler }: { varsler: Varsel[] }) {
  return (
    <VStack gap="3">
      {varsler.map((varsel) => {
        return (
          <HStack gap="2" key={varsel.tekst.nb} wrap={false}>
            <div>
              {varsel.type === Varseltype.WARNING ? (
                <ExclamationmarkTriangleFillIcon color="var(--a-icon-warning)" fontSize="1.25rem" />
              ) : (
                <InformationSquareFillIcon color="var(--a-icon-info)" fontSize="1.25rem" />
              )}
            </div>
            <Brødtekst>{varsel.tekst.nb}</Brødtekst>
          </HStack>
        )
      })}
    </VStack>
  )
}

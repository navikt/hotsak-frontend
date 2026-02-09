import { InlineMessage, VStack } from '@navikt/ds-react'
import { Varsel, Varseltype } from '../../types/BehovsmeldingTypes'

export function Varsler({ varsler }: { varsler?: Varsel[] }) {
  if (!varsler || varsler.length === 0) {
    return null
  }
  return (
    <VStack gap="space-6" paddingBlock="space-6 0">
      {varsler.map((varsel) => {
        return (
          <InlineMessage status={varsel.type === Varseltype.WARNING ? 'warning' : 'info'} size="small">
            {varsel.tekst.nb}
          </InlineMessage>
        )
      })}
    </VStack>
  )
}

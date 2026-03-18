import { VStack } from '@navikt/ds-react'
import { InfoTag, WarningTag } from '../../sak/felles/AlertTag'
import { Varsel, Varseltype } from '../../types/BehovsmeldingTypes'

export function Varsler({ varsler }: { varsler?: Varsel[] }) {
  if (!varsler || varsler.length === 0) {
    return null
  }
  return (
    <VStack gap="space-6" paddingBlock="space-6 space-0">
      {varsler.map((varsel) => {
        return varsel.type === Varseltype.WARNING ? (
          <WarningTag>{varsel.tekst.nb}</WarningTag>
        ) : (
          <InfoTag>{varsel.tekst.nb}</InfoTag>
        )
      })}
    </VStack>
  )
}

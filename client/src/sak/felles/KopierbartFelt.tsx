import { HStack, VStack } from '@navikt/ds-react'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'

export function KopierbarFelt({
  etikett,
  tekst,
  copyText,
  skjulEtikett = false,
  textColor = 'default',
}: KopierbarFeltProps) {
  return (
    <HStack gap="space-8" align="start" wrap={false}>
      <Kopiknapp tooltip={`Kopier ${etikett.toLowerCase()}`} copyText={copyText ?? tekst} placement="bottom" />
      {!skjulEtikett ? (
        <VStack>
          <Etikett>{etikett}</Etikett>
          <Tekst textColor={textColor}>{tekst}</Tekst>
        </VStack>
      ) : (
        <Tekst textColor={textColor}>{tekst}</Tekst>
      )}
    </HStack>
  )
}

interface KopierbarFeltProps {
  etikett: string
  tekst: string
  textColor?: 'subtle' | 'default'
  copyText?: string
  skjulEtikett?: boolean
}

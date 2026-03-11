import { HStack } from '@navikt/ds-react'
import { FinnHjelpemiddelLink } from '../../../felleskomponenter/FinnHjelpemiddelLink'
import { BrytbarBrødtekst, Tekst } from '../../../felleskomponenter/typografi'
import { Kopiknapp } from '../../../felleskomponenter/Kopiknapp'

export function ProduktV2({
  gjennomstrek = false,
  hmsnr,
  navn,
  showLink = true,
}: {
  gjennomstrek?: boolean
  skjulKopiknapp?: boolean
  hmsnr: string
  navn: string
  showLink?: boolean
}) {
  return (
    <HStack gap="space-8" align="start">
      {showLink ? (
        <FinnHjelpemiddelLink variant="neutral" hmsnr={hmsnr}>
          <div style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
            <Tekst>{hmsnr}</Tekst>
          </div>
        </FinnHjelpemiddelLink>
      ) : (
        <BrytbarBrødtekst>{navn}</BrytbarBrødtekst>
      )}
      <Kopiknapp tooltip="Kopier hmsnummer" copyText={hmsnr} placement="bottom" />
      <Tekst weight="semibold" style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
        {navn}
      </Tekst>
    </HStack>
  )
}

import { HStack } from '@navikt/ds-react'
import { BrytbarBrødtekst, Tekst } from '../../../../../felleskomponenter/typografi'
import { InlineKopiknapp } from '../../../../../felleskomponenter/Kopiknapp'
import { FinnHjelpemiddelLink } from '../../../../../felleskomponenter/FinnHjelpemiddelLink'

export function ProduktEksperiment({
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
    <HStack wrap={false} gap="space-8" align="start">
      <HStack align="center" wrap={false}>
        {<InlineKopiknapp tooltip="Kopier hmsnr" copyText={hmsnr} />}
        {showLink ? (
          <FinnHjelpemiddelLink hmsnr={hmsnr}>
            <div style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
              <Tekst>{hmsnr}</Tekst>
            </div>
          </FinnHjelpemiddelLink>
        ) : (
          <BrytbarBrødtekst>{navn}</BrytbarBrødtekst>
        )}
      </HStack>
      <Tekst weight="semibold" style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
        {navn}
      </Tekst>
    </HStack>
  )
}

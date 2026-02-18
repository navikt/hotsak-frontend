import { HStack } from '@navikt/ds-react'
import { FinnHjelpemiddelLink } from '../../felleskomponenter/FinnHjelpemiddelLink'
import { InlineKopiknapp } from '../../felleskomponenter/Kopiknapp'
import { BrytbarBrødtekst, Tekst } from '../../felleskomponenter/typografi'

export function Produkt({
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
    <HStack align={'start'} wrap={false} gap="space-4">
      <HStack wrap={false}>
        <Tekst weight="semibold" style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
          {hmsnr}
        </Tekst>
        {<InlineKopiknapp tooltip="Kopier hmsnr" copyText={hmsnr} />}
      </HStack>
      {showLink ? (
        <FinnHjelpemiddelLink hmsnr={hmsnr}>
          <div style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
            <Tekst>{navn}</Tekst>
          </div>
        </FinnHjelpemiddelLink>
      ) : (
        <BrytbarBrødtekst>{navn}</BrytbarBrødtekst>
      )}
    </HStack>
  )
}

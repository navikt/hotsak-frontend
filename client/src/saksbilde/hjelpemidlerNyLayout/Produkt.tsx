import { HStack, Link } from '@navikt/ds-react'
import { InlineKopiknapp } from '../../felleskomponenter/Kopiknapp'
import { BrytbarBrødtekst, Tekst } from '../../felleskomponenter/typografi'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

export function Produkt({
  gjennomstrek = false,
  hmsnr,
  navn,
  linkTo,
}: {
  gjennomstrek?: boolean
  skjulKopiknapp?: boolean
  hmsnr: string
  navn: string
  linkTo?: string
}) {
  return (
    <HStack align={'start'} wrap={false} gap="1">
      <HStack wrap={false}>
        <Tekst weight="semibold" style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
          {hmsnr}
        </Tekst>
        {<InlineKopiknapp tooltip="Kopier hmsnr" copyText={hmsnr} />}
      </HStack>
      {linkTo ? (
        <Link
          href={linkTo}
          onClick={() => {
            logAmplitudeEvent(amplitude_taxonomy.FINN_HJELPEMIDDEL_LINK_BESØKT, {
              hmsnummer: hmsnr,
              artikkelnavn: navn,
            })
          }}
          target="_blank"
        >
          <div style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>{navn}</div>
        </Link>
      ) : (
        <BrytbarBrødtekst>{navn}</BrytbarBrødtekst>
      )}
    </HStack>
  )
}

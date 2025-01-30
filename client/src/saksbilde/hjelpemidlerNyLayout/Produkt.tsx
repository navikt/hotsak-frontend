import { HStack, Link } from '@navikt/ds-react'
import { InlineKopiknapp } from '../../felleskomponenter/Kopiknapp'
import { BrytbarBrødtekst, Tekst } from '../../felleskomponenter/typografi'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

export function Produkt({
  gjennomstrek = false,
  skjulKopiknapp = false,
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
    <HStack gap="1" align={'start'} wrap={false}>
      <HStack wrap={false} gap="1">
        <Tekst weight="semibold" style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
          {hmsnr}
        </Tekst>
        {!skjulKopiknapp && <InlineKopiknapp tooltip="Kopier hmsnr" copyText={hmsnr} />}
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

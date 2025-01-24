import { HStack, Link } from '@navikt/ds-react'
import { BrytbarBrødtekst, Tekst } from '../../felleskomponenter/typografi'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
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
    <HStack gap="2" align={'start'} wrap={false}>
      <HStack wrap={false}>
        <Tekst weight="semibold" style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
          {hmsnr}
        </Tekst>
        {!skjulKopiknapp && <Kopiknapp tooltip="Kopier hmsnr" copyText={hmsnr} />}
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

import { HStack, Link } from '@navikt/ds-react'
import { Tekst } from '../../felleskomponenter/typografi'
import { Kopiknapp } from '../../felleskomponenter/Kopiknapp'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

export function Produkt({
  gjennomstrek,
  skjulKopiknapp = false,
  hmsnr,
  navn,
  linkTo,
}: {
  gjennomstrek: boolean
  skjulKopiknapp?: boolean
  hmsnr: string
  navn: string
  linkTo?: string
}) {
  return (
    <HStack gap="1" align={'center'}>
      <Tekst weight="semibold" style={{ textDecoration: gjennomstrek ? 'line-through' : '' }}>
        {hmsnr}
      </Tekst>
      {!skjulKopiknapp && <Kopiknapp tooltip="Kopier hmsnr" copyText={hmsnr} />}
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
        <Tekst>{navn}</Tekst>
      )}
    </HStack>
  )
}

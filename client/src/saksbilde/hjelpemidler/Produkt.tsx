import { HStack } from '@navikt/ds-react'
import clsx from 'clsx'
import { FinnHjelpemiddelLink } from '../../felleskomponenter/FinnHjelpemiddelLink'
import { InlineKopiknapp } from '../../felleskomponenter/Kopiknapp'
import { BrytbarBrødtekst, Tekst } from '../../felleskomponenter/typografi'
import classes from './Produkt.module.css'

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
        <Tekst weight="semibold" className={clsx(gjennomstrek && classes.gjennomstrek)}>
          {hmsnr}
        </Tekst>
        {<InlineKopiknapp tooltip="Kopier hmsnr" copyText={hmsnr} />}
      </HStack>
      {showLink ? (
        <FinnHjelpemiddelLink hmsnr={hmsnr}>
          <div className={clsx(gjennomstrek && classes.gjennomstrek)}>
            <Tekst>{navn}</Tekst>
          </div>
        </FinnHjelpemiddelLink>
      ) : (
        <BrytbarBrødtekst>{navn}</BrytbarBrødtekst>
      )}
    </HStack>
  )
}

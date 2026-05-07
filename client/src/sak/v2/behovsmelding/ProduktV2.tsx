import { HStack } from '@navikt/ds-react'
import clsx from 'clsx'
import { FinnHjelpemiddelLink } from '../../../felleskomponenter/FinnHjelpemiddelLink'
import { BrytbarBrødtekst, Tekst } from '../../../felleskomponenter/typografi'
import { Kopiknapp } from '../../../felleskomponenter/Kopiknapp'
import classes from './ProduktV2.module.css'

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
          <div className={clsx(gjennomstrek && classes.gjennomstrek)}>
            <Tekst>{hmsnr}</Tekst>
          </div>
        </FinnHjelpemiddelLink>
      ) : (
        <BrytbarBrødtekst>{navn}</BrytbarBrødtekst>
      )}
      <Kopiknapp tooltip="Kopier hmsnummer" copyText={hmsnr} placement="bottom" />
      <Tekst weight="semibold" className={clsx(gjennomstrek && classes.gjennomstrek)}>
        {navn}
      </Tekst>
    </HStack>
  )
}

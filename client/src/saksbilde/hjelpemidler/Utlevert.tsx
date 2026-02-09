import { HStack, InlineMessage } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Utlevertinfo, UtlevertType } from '../../types/BehovsmeldingTypes'

interface UtlevertProps {
  alleredeUtlevert: boolean
  utlevertInfo: Utlevertinfo
  harVarsel?: boolean
}

export function Utlevert({ alleredeUtlevert, utlevertInfo }: UtlevertProps) {
  if (!alleredeUtlevert) return null

  let utlevertTekst
  switch (utlevertInfo.utleverttype) {
    case UtlevertType.FREMSKUTT_LAGER:
      utlevertTekst = 'Fra fremskutt lager'
      break
    case UtlevertType.OVERFØRT:
      utlevertTekst = `Overført fra annen bruker. Brukernummer ${utlevertInfo.annenKommentar}`
      break
    case UtlevertType.KORTTIDSLÅN:
      utlevertTekst = 'Korttidsutlån/utprøvingslån'
      break
    case UtlevertType.ANNET:
      utlevertTekst = ` ${utlevertInfo.annenKommentar}`
      break
  }

  return (
    <InlineMessage status={'warning'} size="small">
      <HStack gap="space-4">
        <Etikett>Utlevert: </Etikett>
        <Tekst>{utlevertTekst}</Tekst>
      </HStack>
    </InlineMessage>
  )
}

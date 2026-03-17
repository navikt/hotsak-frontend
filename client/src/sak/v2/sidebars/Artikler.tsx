import { BodyLong, Detail, HStack, VStack } from '@navikt/ds-react'
import { TextContainer } from '../../../felleskomponenter/typografi'
import { HjelpemiddelArtikkel } from '../../../types/types.internal'
import { formaterDato } from '../../../utils/dato'

export function Artikler({ artikler }: { artikler: HjelpemiddelArtikkel[] }) {
  return (
    <>
      {artikler.map((artikkel) => {
        const artikkelBeskrivelse = artikkel.grunndataProduktNavn || artikkel.beskrivelse
        return (
          <VStack key={`${artikkel.hmsnr}_${artikkel.datoUtsendelse}`}>
            <HStack gap="space-8">
              <TextContainer>
                <BodyLong size="small">{`${artikkel.hmsnr} ${artikkelBeskrivelse}`}</BodyLong>
              </TextContainer>
            </HStack>
            <HStack>
              <Detail color="subtle">{`${artikkel.antall} ${artikkel.antallEnhet.toLowerCase()} - utlånt ${formaterDato(artikkel.datoUtsendelse)}`}</Detail>
            </HStack>
          </VStack>
        )
      })}
    </>
  )
}

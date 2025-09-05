import { useState } from 'react'

import { Box, ErrorMessage, HStack, TextField, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { Etikett, Tekst } from '../../../../felleskomponenter/typografi.tsx'
import { useHjelpemiddel } from '../useHjelpemiddel.ts'

interface EndreHjelpemiddelModalProps {
  hmsArtNr: string
  nåværendeHmsArtNr?: string
}

export function HmsNrVelger(props: EndreHjelpemiddelModalProps) {
  const { hmsArtNr, nåværendeHmsArtNr } = props

  const [submitAttempt] = useState(false)
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext()
  const endreProduktHmsnr = watch('endretProdukt.0') || ''

  const { hjelpemiddel, isError } = useHjelpemiddel(endreProduktHmsnr)

  const errorEndretProdukt = () => {
    if (!hjelpemiddel || hjelpemiddel?.hmsnr === nåværendeHmsArtNr) {
      return 'Du må oppgi et nytt, gyldig HMS-nr'
    }
  }

  // TODO legg på igjen custom valideringsregler
  // TODO legg tilbake duplisert endreHjelpemiddel komponent for de som ikke er pilot
  // TODO visning når det ikke finnes noen alternativer på lager
  // TODO fix sånn at endreProdukt ikke trenger å være en array
  // TODO forenkle markup under
  // Finn ut av det med nåværendeHmsNr, trenger vi det fortsatt?

  /*const errorBegrunnelseFritekst = () => {
    if (endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ANNET && endreBegrunnelseFritekst.length === 0) {
      return 'Du må fylle inn en begrunnelse'
    }

    if (
      endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ANNET &&
      endreBegrunnelseFritekst.length > MAKS_TEGN_BEGRUNNELSE_FRITEKST
    ) {
      const antallForMange = endreBegrunnelseFritekst.length - MAKS_TEGN_BEGRUNNELSE_FRITEKST
      return `Antall tegn for mange ${antallForMange}`
    }
  }*/

  /*const errorBegrunnelse = () => {
    if (!endreBegrunnelse) {
      return 'Du må velge en begrunnelse'
    }
  }*/

  /*const validationError = () => {
    return errorEndretProdukt() /*|| errorBegrunnelseFritekst() || errorBegrunnelse()
  }*/

  return (
    <>
      <Box paddingBlock="0 4">
        <Tekst>Her kan du endre hjelpemidler som begrunner har lagt inn.</Tekst>
      </Box>
      <Box.New padding="6" background="neutral-soft" borderRadius="large">
        <VStack gap="3">
          <HStack gap="3" wrap={false}>
            <div>
              <TextField
                label="HMS-nummer"
                size="small"
                maxLength={6}
                value={endreProduktHmsnr}
                onChange={(event) => {
                  //          if (event.target.value.length === 6) {
                  setValue('endretProdukt.0', event.target.value)
                  //        }
                }}
                error={submitAttempt && errorEndretProdukt()}
              />
            </div>
            <VStack gap="1">
              <Etikett>Beskrivelse</Etikett>
              <Tekst>
                {hmsArtNr !== '' && isError ? (
                  <ErrorMessage>Hjelpemiddel ikke funnet i hjelpemiddeldatabasen eller OeBS</ErrorMessage>
                ) : (
                  (hjelpemiddel?.navn ?? '')
                )}
              </Tekst>
            </VStack>
          </HStack>
        </VStack>
      </Box.New>
    </>
  )
}

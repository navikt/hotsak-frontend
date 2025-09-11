import { useState } from 'react'

import { Box, HStack, Link, Loader, TextField, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { Brødtekst, Etikett, Tekst, Undertittel } from '../../../../felleskomponenter/typografi.tsx'
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

  const { hjelpemiddel, error, isLoading } = useHjelpemiddel(endreProduktHmsnr)

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
  // TODO validering på 6 siffer i HmsNr før det er lov å lagre
  // Finn ut av det med nåværendeHmsNr, trenger vi det fortsatt?
  // Teste hvordan card i endre hms nummer funker når kilde er OEBS
  // Fast bredde som tar høyde for scrollbare sånn at modal ikke hopper i bredden
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
      <Box.New padding="0" /*background="neutral-soft"*/ borderRadius="large">
        <HStack align="start" gap="space-64">
          <HStack gap="3" wrap={false} align={'end'}>
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

            {isLoading && (
              <HStack gap="3" align={'center'} marginBlock={'0 space-4'}>
                <Loader size="medium" title="Søker etter hjelpemiddel..." />
                <Brødtekst>Søker etter hjelpemiddel...</Brødtekst>
              </HStack>
            )}

            {/*<VStack gap="1">
              <Etikett>Beskrivelse</Etikett>
              <Tekst>
                {hmsArtNr !== '' && error ? (
                  <ErrorMessage>Hjelpemiddel ikke funnet i hjelpemiddeldatabasen eller OeBS</ErrorMessage>
                ) : (
                  (hjelpemiddel?.navn ?? '')
                )}
              </Tekst>
            </VStack>*/}
          </HStack>
          {hjelpemiddel && (
            <Box.New
              borderWidth="1"
              borderColor="neutral-subtle"
              background="raised"
              borderRadius="large"
              marginBlock="space-28 0"
              padding="4"
              width="230px"
              //marginBlock="8 0"
            >
              <VStack gap="3">
                <HStack justify="center">
                  {hjelpemiddel.produktbildeUri && (
                    <img
                      alt="Produktbilde"
                      src={hjelpemiddel.produktbildeUri}
                      style={{
                        //height: '185px',
                        width: '180px',
                        //maxWidth: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  )}
                </HStack>
                <VStack>
                  <Etikett size="small">
                    <Link href={`https://finnhjelpemiddel.nav.no/${hjelpemiddel.hmsnr}`} target="_blank">
                      {hjelpemiddel.navn}
                    </Link>
                  </Etikett>
                  <Undertittel>{`Hmsnr: ${hjelpemiddel.hmsnr}`}</Undertittel>
                  <Brødtekst>{hjelpemiddel.leverandør}</Brødtekst>
                </VStack>
              </VStack>
            </Box.New>
          )}
        </HStack>
      </Box.New>
    </>
  )
}

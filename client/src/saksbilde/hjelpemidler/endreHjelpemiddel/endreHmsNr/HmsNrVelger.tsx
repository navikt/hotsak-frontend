import { useEffect } from 'react'

import { Alert, Box, HStack, Loader, TextField } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Brødtekst, Tekst } from '../../../../felleskomponenter/typografi.tsx'
import { useHjelpemiddel } from '../useHjelpemiddel.ts'
import { ProduktCard } from './ProduktCard.tsx'

/*interface EndreHjelpemiddelModalProps {
  hmsArtNr: string
  nåværendeHmsArtNr?: string
}*/

export function HmsNrVelger(/*props: EndreHjelpemiddelModalProps*/) {
  //const { hmsArtNr, nåværendeHmsArtNr } = props

  const {
    watch,
    trigger,
    setValue,
    control,
    //formState: { errors },
  } = useFormContext()
  const endreProduktHmsnr = watch('endretProdukt.0') || ''

  const { hjelpemiddel, error, isLoading } = useHjelpemiddel(endreProduktHmsnr)

  /*const errorEndretProdukt = () => {
    if (!hjelpemiddel || hjelpemiddel?.hmsnr === nåværendeHmsArtNr) {
      return 'Du må oppgi et nytt, gyldig HMS-nr'
    }
  }*/

  // Teste hvordan card i endre hms nummer funker når kilde er OEBS
  // TODO visning når det ikke finnes noen alternativer på lager
  // TODO fix sånn at endreProdukt ikke trenger å være en array
  // TODO forenkle markup under
  // Finn ut av det med nåværendeHmsNr, trenger vi det fortsatt?
  // Slå sammen de ulike produktkortene til en felles komponent
  // Teste mot gamle ENUM verdier på endret begrunnelse?
  // Reset form etter submit
  // Velge checkbox ved klikk hvor som helst på boksen
  // Toast når endring er lagret

  useEffect(() => {
    if (endreProduktHmsnr.length === 6 && !isLoading && error) {
      setValue('produktMangler', true)
    }
  }, [hjelpemiddel, error, isLoading, endreProduktHmsnr, trigger])

  return (
    <>
      <Box paddingBlock="0 4">
        <Tekst>Her kan du endre hjelpemidler som begrunner har lagt inn.</Tekst>
      </Box>
      <Box.New padding="0" borderRadius="large">
        <HStack align="start" gap="space-64" wrap={true}>
          <HStack gap="space-12" wrap={true} align={'end'}>
            <Box width="200px">
              <Controller
                name="endretProdukt.0"
                control={control}
                rules={{
                  required: 'Fyll inn et HMS-nummer',

                  validate: (value) => {
                    if (value.length !== 6) {
                      return 'Fyll inn et gyldig HMS-nummer'
                    }
                  },
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="HMS-nummer"
                    size="small"
                    maxLength={6}
                    value={endreProduktHmsnr}
                    error={fieldState.error?.message}
                  />
                )}
              />
            </Box>

            {isLoading && !error && (
              <HStack gap="3" align={'center'} marginBlock={'0 space-4'}>
                <Loader size="medium" title="Søker etter hjelpemiddel..." />
                <Brødtekst>Søker etter hjelpemiddel...</Brødtekst>
              </HStack>
            )}
            {!hjelpemiddel && error && (
              <Box marginBlock={'0 space-4'}>
                <Alert variant="error" inline title="Fant ikke hjelpemiddel" size="small">
                  <Brødtekst>HMS-nummer ikke funnet i FinnHjelpemiddel eller OeBS</Brødtekst>
                </Alert>
              </Box>
            )}
          </HStack>
          {hjelpemiddel && <ProduktCard hjelpemiddel={hjelpemiddel} />}
        </HStack>
      </Box.New>
    </>
  )
}

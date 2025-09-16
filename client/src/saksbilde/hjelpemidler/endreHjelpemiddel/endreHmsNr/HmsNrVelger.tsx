import { useEffect, useState } from 'react'

import { Box, HGrid, HStack, Link, Loader, TextField, VStack } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Brødtekst, Etikett, Tekst } from '../../../../felleskomponenter/typografi.tsx'
import { useHjelpemiddel } from '../useHjelpemiddel.ts'

/*interface EndreHjelpemiddelModalProps {
  hmsArtNr: string
  nåværendeHmsArtNr?: string
}*/

export function HmsNrVelger(/*props: EndreHjelpemiddelModalProps*/) {
  //const { hmsArtNr, nåværendeHmsArtNr } = props

  const [harProduktResultat, setHarProduktResultat] = useState(false)
  const {
    watch,
    trigger,
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

  useEffect(() => {
    if (endreProduktHmsnr.length === 6 && !isLoading) {
      setHarProduktResultat(true)
      trigger('endretProdukt.0')
    }
  }, [hjelpemiddel, error, isLoading, endreProduktHmsnr, trigger])

  return (
    <>
      <Box paddingBlock="0 4">
        <Tekst>Her kan du endre hjelpemidler som begrunner har lagt inn.</Tekst>
      </Box>
      <Box.New padding="0" /*background="neutral-soft"*/ borderRadius="large">
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
                      return 'Fyll inn et gylidig HMS-nummer'
                    }

                    if (!harProduktResultat) {
                      return true
                    }

                    if (value.length === 6 && !hjelpemiddel && !isLoading) {
                      return 'HMS-nummer ikke funnet i FinnHjelpemiddel eller OeBS'
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

            {isLoading && (
              <HStack gap="3" align={'center'} marginBlock={'0 space-4'}>
                <Loader size="medium" title="Søker etter hjelpemiddel..." />
                <Brødtekst>Søker etter hjelpemiddel...</Brødtekst>
              </HStack>
            )}
          </HStack>
          {hjelpemiddel && (
            <Box.New
              borderWidth="1"
              borderColor="neutral-subtle"
              background="raised"
              borderRadius="large"
              marginBlock="space-28 0"
              padding="4"
            >
              <VStack>
                <Etikett size="small" spacing>
                  {hjelpemiddel.navn}
                </Etikett>
                <HGrid columns="1fr 1fr" gap="space-16">
                  <HStack justify="center">
                    {hjelpemiddel.produktbildeUri && (
                      <img
                        alt="Produktbilde"
                        src={hjelpemiddel.produktbildeUri}
                        style={{
                          width: '150px',
                          objectFit: 'contain',
                        }}
                      />
                    )}
                  </HStack>
                  <VStack>
                    <Link href={`https://finnhjelpemiddel.nav.no/${hjelpemiddel.hmsnr}`} target="_blank">
                      <Brødtekst>{`Hmsnr: ${hjelpemiddel.hmsnr}`}</Brødtekst>
                    </Link>
                    <Brødtekst>{hjelpemiddel.leverandør}</Brødtekst>
                  </VStack>
                </HGrid>
              </VStack>
            </Box.New>
          )}
        </HStack>
      </Box.New>
    </>
  )
}

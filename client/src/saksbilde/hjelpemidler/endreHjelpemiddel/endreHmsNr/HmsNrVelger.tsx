import { useEffect } from 'react'

import { Alert, Box, HStack, Loader, TextField } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Tekst } from '../../../../felleskomponenter/typografi.tsx'
import { useHjelpemiddel } from '../useHjelpemiddel.ts'
import { ProduktCard } from './ProduktCard.tsx'

export function HmsNrVelger({ nåværendeHmsnr }: { nåværendeHmsnr?: string }) {
  const { watch, trigger, setValue, control } = useFormContext()
  const endreProduktHmsnr = watch('endretProdukt') || ''

  const { hjelpemiddel, error, isLoading } = useHjelpemiddel(endreProduktHmsnr)

  // Vise lagervare tag
  // Link til endret hjelpemiddel hvis kilder !== oebs

  useEffect(() => {
    if (endreProduktHmsnr.length === 6 && !isLoading && error) {
      setValue('produktMangler', true)
    }
  }, [hjelpemiddel, error, isLoading, endreProduktHmsnr, trigger])

  return (
    <>
      <Box paddingBlock="space-0 space-16">
        <Tekst>Her kan du endre hjelpemidler som begrunner har lagt inn.</Tekst>
      </Box>
      <Box padding="space-0" borderRadius="large">
        <HStack align="start" gap="space-32" wrap={true}>
          <HStack gap="space-12" wrap={true} align={'end'}>
            <Box width="200px">
              <Controller
                name="endretProdukt"
                control={control}
                rules={{
                  required: 'Fyll inn et HMS-nummer',

                  validate: (value) => {
                    if (value.length !== 6) {
                      return 'Fyll inn et gyldig HMS-nummer'
                    }
                    if (value === nåværendeHmsnr) {
                      return 'Du må oppgi et annet HMS-nummer enn det nåværende'
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
              <HStack gap="space-12" align={'center'} marginBlock={'space-0 space-4'}>
                <Loader size="medium" title="Søker etter hjelpemiddel..." />
                <Tekst>Søker etter hjelpemiddel...</Tekst>
              </HStack>
            )}
            {!hjelpemiddel && error && (
              <Box marginBlock={'space-0 space-4'}>
                <Alert variant="error" inline title="Fant ikke hjelpemiddel" size="small">
                  <Tekst>HMS-nummer ikke funnet i FinnHjelpemiddel eller OeBS</Tekst>
                </Alert>
              </Box>
            )}
          </HStack>
          {hjelpemiddel && <ProduktCard hjelpemiddel={hjelpemiddel} />}
        </HStack>
      </Box>
    </>
  )
}

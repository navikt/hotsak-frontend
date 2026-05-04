import { Alert, Box, Button, Heading, HStack, InlineMessage, Textarea, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

const MAX_LENGDE_BESKJED = 150

export function FritekstPanel() {
  const { control, clearErrors } = useFormContext()
  const [harLagretBeskjed, setHarLagretBeskjed] = useState(false)
  const [beskjedlengdeError, setBeskjedlengdeError] = useState(false)

  return (
    <Box padding="space-16" background="neutral-soft" borderRadius="12">
      <VStack gap="space-16">
        <Heading level="2" size="xsmall" spacing>
          Beskjed fra formidler til kommunen om utlevering
        </Heading>
        <Alert variant="info" size="small" inline>
          Beskjeden fra formidler vil vises på følgeseddelen til hjelpemidlene, på 5.17-skjema.
        </Alert>

        <Controller
          name="utleveringMerknad"
          control={control}
          rules={{
            validate: () =>
              harLagretBeskjed ||
              'Du må sjekke at beskjeden ikke inneholder personopplysninger eller sensitiv informasjon og lagre den før du kan godkjenne.',
          }}
          render={({ field, fieldState }) => (
            <VStack gap="space-16">
              <Textarea
                label="Beskjed til kommunen"
                description="Sjekk teksten og fjern sensitive opplysninger"
                size="small"
                {...field}
                value={field.value ?? ''}
                maxLength={MAX_LENGDE_BESKJED}
                readOnly={harLagretBeskjed}
                error={
                  fieldState.error?.message ||
                  (beskjedlengdeError && `Kort ned beskjeden slik at den er under ${MAX_LENGDE_BESKJED} tegn.`)
                }
                onChange={(e) => {
                  if (beskjedlengdeError && e.target.value.length <= MAX_LENGDE_BESKJED) {
                    setBeskjedlengdeError(false)
                  }
                  field.onChange(e)
                }}
              />
              <HStack align="center" gap="space-8">
                {harLagretBeskjed ? (
                  <>
                    <InlineMessage status="success" size="small">
                      Du har godkjent beskjeden
                    </InlineMessage>
                    <Button
                      type="button"
                      variant="tertiary"
                      size="small"
                      onClick={() => {
                        clearErrors('utleveringMerknad')
                        setHarLagretBeskjed(false)
                      }}
                    >
                      Angre
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      if ((field.value ?? '').length > MAX_LENGDE_BESKJED) {
                        setBeskjedlengdeError(true)
                        return
                      }
                      setHarLagretBeskjed(true)
                    }}
                  >
                    Godkjenn beskjed
                  </Button>
                )}
              </HStack>
            </VStack>
          )}
        />
      </VStack>
    </Box>
  )
}

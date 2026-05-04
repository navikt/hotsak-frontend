import { Alert, Box, HelpText, HStack, Radio, RadioGroup, VStack } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Person } from '../../types/types.internal'
import { formaterNavn } from '../../utils/formater'

export function BrevTilBrukerEllerVerge({
  person,
  value,
  onChange,
  error,
}: {
  person: Person
  value: boolean | undefined
  onChange: (value: boolean) => void
  error?: string
}) {
  const hjelpemiddelVerge = person.vergemål?.find((vergemål) =>
    vergemål.vergeEllerFullmektig.tjenesteomraade?.some((tjeneste) => tjeneste.tjenesteoppgave === 'hjelpemidler')
  )

  if (!hjelpemiddelVerge) {
    return null
  }

  return (
    <Box padding="space-16" background="neutral-soft" borderRadius="12" marginBlock="space-16 space-0">
      <VStack gap="space-8">
        <HStack wrap={false} gap="space-8" align="center">
          <Etikett>Send vedtaksbrev til bruker eller verge</Etikett>
          <HelpText strategy="fixed">
            <Tekst>
              Brukeren har en verge på hjelpemiddelområdet. Du kan sende vedtaksbrevet til enten brukeren eller vergen.
            </Tekst>
          </HelpText>
        </HStack>
        <Alert variant="info" size="small" inline>
          Verge på hjelpemiddelområdet:{' '}
          <strong>{formaterNavn(hjelpemiddelVerge.vergeEllerFullmektig.identifiserendeInformasjon.navn)}</strong>
        </Alert>
        <RadioGroup
          legend="Velg hvem brevet skal sendes til"
          size="small"
          value={value ?? ''}
          onChange={onChange}
          error={error}
        >
          <Radio value={false}>Bruker</Radio>
          <Radio value={true}>Verge</Radio>
        </RadioGroup>
      </VStack>
    </Box>
  )
}

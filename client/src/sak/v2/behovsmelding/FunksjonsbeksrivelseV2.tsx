import { Box, Heading, Label, VStack } from '@navikt/ds-react'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { BrytbarBrødtekst, Tekst, TextContainer } from '../../../felleskomponenter/typografi'
import { Funksjonsbeskrivelse } from '../../../types/BehovsmeldingTypes'
import { tekstByFunksjonsnedsettelse } from './tilbehør/funksjonsnedsettelser'

export function FunksjonsbeskrivelseV2(props: { funksjonsbeskrivelse?: Funksjonsbeskrivelse; skjulHeading?: boolean }) {
  const { funksjonsbeskrivelse } = props

  if (!funksjonsbeskrivelse) {
    return (
      <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
        <Heading size="xsmall" spacing>
          Funksjonsbeskrivelse mangler
        </Heading>
        <Tekst>
          Behovsmeldingen ble automatisk gjort om fra bestilling til søknad, da Hotsak av tekniske årsaker ikke kan
          opprette en ordre i denne saken. Søknaden oppfyller kravene til bestillingsordningen. Derfor har ikke søknaden
          en funksjonsbeskrivelse.
        </Tekst>
      </Box>
    )
  }

  const { beskrivelse } = funksjonsbeskrivelse

  return (
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <VStack>
        <Label size="small" as="h2" textColor="subtle" spacing>
          Sykdom, skade, lyte
        </Label>
        <TextContainer>
          <Tekst>{tekstByFunksjonsnedsettelse(funksjonsbeskrivelse)}</Tekst>
        </TextContainer>
        {beskrivelse && (
          <>
            <Skillelinje />
            <Label size="small" as="h2" textColor="subtle" spacing>
              Funksjonsbeskrivelse
            </Label>
            <TextContainer>
              <BrytbarBrødtekst>{beskrivelse}</BrytbarBrødtekst>
            </TextContainer>
          </>
        )}
      </VStack>
    </Box>
  )
}

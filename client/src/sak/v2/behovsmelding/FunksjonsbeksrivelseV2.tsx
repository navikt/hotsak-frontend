import { Box, Heading, Label, VStack } from '@navikt/ds-react'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { BrytbarBrødtekst, Tekst, TextContainer } from '../../../felleskomponenter/typografi'
import { Funksjonsbeskrivelse } from '../../../types/BehovsmeldingTypes'
import { tekstByFunksjonsnedsettelse } from './tilbehør/funksjonsnedsettelser'
import { useBehovsmelding } from '../../../saksbilde/useBehovsmelding'
import { CompactExpandableCard } from '../../../felleskomponenter/panel/CompactExpandableCard'

export function FunksjonsbeskrivelseV2(props: { funksjonsbeskrivelse?: Funksjonsbeskrivelse }) {
  const { funksjonsbeskrivelse } = props
  const { harKunTilbehør } = useBehovsmelding()

  return (
    <CompactExpandableCard tittel="Om brukeren" defaultOpen={!!funksjonsbeskrivelse}>
      <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
        <FunksjonsbeskrivelseContent funksjonsbeskrivelse={funksjonsbeskrivelse} harKunTilbehør={harKunTilbehør} />
      </Box>
    </CompactExpandableCard>
  )
}

function FunksjonsbeskrivelseContent({
  funksjonsbeskrivelse,
  harKunTilbehør,
}: {
  funksjonsbeskrivelse?: Funksjonsbeskrivelse
  harKunTilbehør: boolean
}) {
  if (!funksjonsbeskrivelse) {
    if (harKunTilbehør) {
      return (
        <>
          <Heading size="xsmall" spacing>
            Funksjonsbeskrivelse
          </Heading>
          <TextContainer>
            <Tekst>
              Det er kun søkt om tilbehør i denne saken. Beskrivelse av brukers funksjon vil som oftest gå frem av
              søknaden om hjelpemidlet som tilbehøret skal brukes sammen med. Fordi Nav allerede har denne
              informasjonen, anses det ikke nødvendig å oppgi funksjonsbeskrivelsen en gang til.
            </Tekst>
          </TextContainer>
        </>
      )
    }

    return (
      <>
        <Heading size="xsmall" spacing>
          Funksjonsbeskrivelse
        </Heading>
        <TextContainer>
          <Tekst>
            Behovsmeldingen ble automatisk gjort om fra bestilling til søknad, da Hotsak av tekniske årsaker ikke kan
            opprette en ordre i denne saken. Søknaden oppfyller kravene til bestillingsordningen. Derfor har ikke
            søknaden en funksjonsbeskrivelse.
          </Tekst>
        </TextContainer>
      </>
    )
  }

  const { beskrivelse } = funksjonsbeskrivelse

  return (
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
  )
}

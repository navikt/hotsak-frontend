import { Box, Label, VStack } from '@navikt/ds-react'
import { Skillelinje } from '../../../felleskomponenter/Strek'
import { BrytbarBrødtekst, Tekst, TextContainer } from '../../../felleskomponenter/typografi'
import { Funksjonsbeskrivelse, InnbyggersVarigeFunksjonsnedsettelse } from '../../../types/BehovsmeldingTypes'

export function FunksjonsbeskrivelseV2(props: { funksjonsbeskrivelse: Funksjonsbeskrivelse; skjulHeading?: boolean }) {
  const { funksjonsbeskrivelse } = props
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

export const tekstByFunksjonsnedsettelse = (brukerFunksjon: Funksjonsbeskrivelse) => {
  const tekst: Record<keyof typeof InnbyggersVarigeFunksjonsnedsettelse, string> = {
    [InnbyggersVarigeFunksjonsnedsettelse.ALDERDOMSSVEKKELSE]: 'Innbygger har alderdomssvekkelse.',
    [InnbyggersVarigeFunksjonsnedsettelse.ANNEN_VARIG_DIAGNOSE]: `Innbygger har en varig diagnose: ${brukerFunksjon.diagnose}`,
    [InnbyggersVarigeFunksjonsnedsettelse.ANNEN_DIAGNOSE]: `Innbygger har en diagnose: ${brukerFunksjon.diagnose}`,
    [InnbyggersVarigeFunksjonsnedsettelse.UAVKLART]:
      'Det er uavklart om innbygger har en varig sykdom, skade eller lyte.',
    [InnbyggersVarigeFunksjonsnedsettelse.UAVKLART_V2]:
      'Det er uavklart om personen har en sykdom, skade eller lyte som har ført til varig og vesentlig nedsatt funksjonsevne.',
  }
  return tekst[brukerFunksjon.innbyggersVarigeFunksjonsnedsettelse]
}

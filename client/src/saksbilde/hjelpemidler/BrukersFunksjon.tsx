import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'
import { Box, Button, HStack, Label, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { BrytbarBrødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi.tsx'
import { textcontainerBredde } from '../../GlobalStyles.tsx'
import { Funksjonsbeskrivelse, InnbyggersVarigeFunksjonsnedsettelse } from '../../types/BehovsmeldingTypes.ts'

export function BrukersFunksjon(props: { funksjonsbeskrivelse: Funksjonsbeskrivelse; collapsible?: boolean }) {
  const { funksjonsbeskrivelse, collapsible = false } = props
  const { beskrivelse } = funksjonsbeskrivelse
  const [skjultFunksjonsbeskrivelse, setSkjultFunksjonsbeskrivelse] = useState(false)
  return (
    <Box.New paddingInline={'space-0 space-8'} paddingBlock="space-8">
      <HStack align="center">
        {collapsible && (
          <Button
            variant="tertiary"
            size="small"
            icon={skjultFunksjonsbeskrivelse ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setSkjultFunksjonsbeskrivelse(!skjultFunksjonsbeskrivelse)}
          />
        )}
        <Label size="small" as="h2" textColor="subtle" spacing={!collapsible}>
          FUNKSJONSBESKRIVELSE
        </Label>
      </HStack>
      {!skjultFunksjonsbeskrivelse && (
        <Box.New
          paddingBlock="space-8"
          paddingInline="space-12"
          borderRadius="large"
          background="neutral-softA"
          borderColor="neutral-subtle"
          borderWidth="1"
        >
          <VStack gap="space-24" style={{ maxWidth: `${textcontainerBredde}` }}>
            <Box>
              <Etikett>
                Innbyggers sykdom, skade eller lyte som har ført til varig og vesentlig nedsatt funksjonsevne:
              </Etikett>
              <Tekst>{tekstByFunksjonsnedsettelse(funksjonsbeskrivelse)}</Tekst>
            </Box>
            {beskrivelse && (
              <Box>
                <Etikett>
                  Funksjonsbeskrivelse av bruker, med beskrivelse av konsekvensene den nedsatte funksjonsevnen har for
                  bruker i dagliglivet:
                </Etikett>
                <BrytbarBrødtekst>{beskrivelse}</BrytbarBrødtekst>
              </Box>
            )}
          </VStack>
        </Box.New>
      )}
    </Box.New>
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

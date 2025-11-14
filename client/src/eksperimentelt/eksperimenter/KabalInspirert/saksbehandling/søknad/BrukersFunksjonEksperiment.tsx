import { Box, Button, HStack, Label, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../../../../felleskomponenter/typografi'
import { tekstByFunksjonsnedsettelse } from '../../../../../saksbilde/hjelpemidler/BrukersFunksjon'
import { Funksjonsbeskrivelse } from '../../../../../types/BehovsmeldingTypes'
import { textcontainerBredde } from '../../../../../GlobalStyles'
import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons'

export function BrukersFunksjonEksperiment(props: { funksjonsbeskrivelse: Funksjonsbeskrivelse }) {
  const { funksjonsbeskrivelse } = props
  const { beskrivelse } = funksjonsbeskrivelse
  const [skjultFunksjonsbeskrivelse, setSkjultFunksjonsbeskrivelse] = useState(false)
  return (
    <Box.New paddingInline={'space-0 space-8'} paddingBlock="space-8">
      <HStack align="center">
        <Button
          variant="tertiary"
          size="small"
          icon={skjultFunksjonsbeskrivelse ? <ChevronUpIcon /> : <ChevronDownIcon />}
          onClick={() => setSkjultFunksjonsbeskrivelse(!skjultFunksjonsbeskrivelse)}
        />
        <Label size="small" as="h2" textColor="subtle">
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
              <Brødtekst>{tekstByFunksjonsnedsettelse(funksjonsbeskrivelse)}</Brødtekst>
            </Box>
            {beskrivelse && (
              <Box>
                <Etikett>
                  Funksjonsbeskrivelse av bruker, med beskrivelse av konsekvensene den nedsatte funksjonsevnen har for
                  bruker i dagliglivet:
                </Etikett>
                <Brødtekst>{beskrivelse}</Brødtekst>
              </Box>
            )}
          </VStack>
        </Box.New>
      )}
    </Box.New>
  )
}

import { Box, Label, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../../../../felleskomponenter/typografi'
import { tekstByFunksjonsnedsettelse } from '../../../../../saksbilde/hjelpemidler/BrukersFunksjon'
import { Funksjonsbeskrivelse } from '../../../../../types/BehovsmeldingTypes'
import { textcontainerBredde } from '../../../../../GlobalStyles'

export function BrukersFunksjonEksperiment(props: { funksjonsbeskrivelse: Funksjonsbeskrivelse }) {
  const { funksjonsbeskrivelse } = props
  const { beskrivelse } = funksjonsbeskrivelse
  return (
    <Box.New paddingInline={'space-0 space-8'}>
      <Label size="small" as="h2" spacing textColor="subtle">
        FUNKSJONSVURDERING
      </Label>
      <Box.New
        paddingBlock="space-8"
        paddingInline="space-12"
        borderRadius="large"
        background="sunken"
        //borderColor="neutral-subtle"
        //borderWidth="1"
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
                Funksjonsvurdering av innbygger, med beskrivelse av konsekvensene den nedsatte funksjonsevnen har for
                innbygger i dagliglivet:
              </Etikett>
              <Brødtekst>{beskrivelse}</Brødtekst>
            </Box>
          )}
        </VStack>
      </Box.New>
    </Box.New>
  )
}

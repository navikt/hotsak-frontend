import { Box, Label, VStack } from '@navikt/ds-react'
import { BrytbarBrødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi.tsx'
import { Funksjonsbeskrivelse } from '../../types/BehovsmeldingTypes.ts'
import { tekstByFunksjonsnedsettelse } from '../../sak/v2/behovsmelding/tilbehør/funksjonsnedsettelser.ts'
import classes from './BrukersFunksjon.module.css'

export function BrukersFunksjon(props: { funksjonsbeskrivelse: Funksjonsbeskrivelse; skjulHeading?: boolean }) {
  const { funksjonsbeskrivelse, skjulHeading = false } = props
  const { beskrivelse } = funksjonsbeskrivelse

  return (
    <Box paddingInline={'space-0 space-8'} paddingBlock="space-8">
      {!skjulHeading && (
        <Label size="small" as="h2" textColor="subtle" spacing>
          FUNKSJONSBESKRIVELSE
        </Label>
      )}
      <Box
        paddingBlock="space-8"
        paddingInline="space-12"
        borderRadius="8"
        background="neutral-softA"
        borderColor="neutral-subtle"
        borderWidth="1"
      >
        <VStack gap="space-24" className={classes.content}>
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
      </Box>
    </Box>
  )
}

import { Box, Heading, List, VStack } from '@navikt/ds-react'
import { Funksjonsbeskrivelse, InnbyggersVarigeFunksjonsnedsettelse } from '../../types/BehovsmeldingTypes.ts'
import { Brødtekst, Etikett } from '../../felleskomponenter/typografi.tsx'

export function BrukersFunksjon(props: { funksjonsbeskrivelse: Funksjonsbeskrivelse }) {
  const { funksjonsbeskrivelse } = props
  const { beskrivelse } = funksjonsbeskrivelse
  return (
    <Box paddingBlock="10" paddingInline={{ xs: '0 4', sm: '0 4', md: '0 32' }} maxWidth={'1200px'}>
      <Heading level="1" size="small" spacing>
        Funksjonsvurdering
      </Heading>
      <VStack gap="4">
        <List
          title="Innbyggers varige sykdom, skade eller lyte som har ført til vesentlig nedsatt funksjonsevne:"
          size="small"
        >
          <List.Item>{tekstByFunksjonsnedsettelse(funksjonsbeskrivelse)}</List.Item>
        </List>
        {beskrivelse && (
          <>
            <Etikett>
              Funksjonsvurdering av innbygger, med beskrivelse av konsekvensene den nedsatte funksjonsevnen har for
              innbygger i dagliglivet:
            </Etikett>
            <Brødtekst>{beskrivelse}</Brødtekst>
          </>
        )}
      </VStack>
    </Box>
  )
}

const tekstByFunksjonsnedsettelse = (brukerFunksjon: Funksjonsbeskrivelse) => {
  const tekst: Record<keyof typeof InnbyggersVarigeFunksjonsnedsettelse, string> = {
    [InnbyggersVarigeFunksjonsnedsettelse.ALDERDOMSSVEKKELSE]: 'Innbygger har alderdomssvekkelse.',
    [InnbyggersVarigeFunksjonsnedsettelse.ANNEN_VARIG_DIAGNOSE]: `Innbygger har en varig diagnose. ${brukerFunksjon.diagnose}`,
    [InnbyggersVarigeFunksjonsnedsettelse.UAVKLART]:
      'Det er uavklart om innbygger har en varig sykdom, skade eller lyte.',
  }
  return tekst[brukerFunksjon.innbyggersVarigeFunksjonsnedsettelse]
}

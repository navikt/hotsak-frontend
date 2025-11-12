import { Box, Heading, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../felleskomponenter/typografi.tsx'
import { Funksjonsbeskrivelse, InnbyggersVarigeFunksjonsnedsettelse } from '../../types/BehovsmeldingTypes.ts'

export function BrukersFunksjon(props: { funksjonsbeskrivelse: Funksjonsbeskrivelse }) {
  const { funksjonsbeskrivelse } = props
  const { beskrivelse } = funksjonsbeskrivelse
  return (
    <Box paddingBlock="0 20" paddingInline={{ xs: '0 4', sm: '0 4' }}>
      <Heading level="1" size="small" spacing>
        Funksjonsvurdering
      </Heading>
      <div style={{ maxWidth: '34rem' }}>
        <VStack gap="6">
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
      </div>
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

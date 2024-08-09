import { Box, Heading, VStack } from '@navikt/ds-react'
import { Brødtekst, Etikett } from '../../felleskomponenter/typografi.tsx'
import { BrukerFunksjon, VarigFunksjonsnedsettelse } from '../../types/types.internal.ts'
import { Fremhevet } from './Fremhevet.tsx'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'

export function BrukersFunksjon(props: { brukerFunksjon: BrukerFunksjon }) {
  const { brukerFunksjon } = props
  const { funksjonsvurdering } = brukerFunksjon
  return (
    <Box paddingBlock="4">
      <Heading level="1" size="medium">
        Brukers funksjon
      </Heading>
      <Box paddingBlock="2">
        <HjelpemiddelGrid>
          <div />
          <Fremhevet>
            <VStack gap="4">
              <div>
                <Etikett>Sykdom, skade eller lyte:</Etikett>
                <Brødtekst>{tekstByFunksjonsnedsettelse(brukerFunksjon)}</Brødtekst>
              </div>
              <div>
                {funksjonsvurdering && (
                  <>
                    <Etikett>Funksjonsvurdering:</Etikett>
                    <Brødtekst>{funksjonsvurdering}</Brødtekst>
                  </>
                )}
              </div>
            </VStack>
          </Fremhevet>
        </HjelpemiddelGrid>
      </Box>
    </Box>
  )
}

const tekstByFunksjonsnedsettelse = (brukerFunksjon: BrukerFunksjon) => {
  const tekst: Record<keyof typeof VarigFunksjonsnedsettelse, string> = {
    [VarigFunksjonsnedsettelse.ALDERDOMSSVEKKELSE]: 'Innbygger har alderdomssvekkelse.',
    [VarigFunksjonsnedsettelse.ANNEN_VARIG_DIAGNOSE]: `Diagnose: ${brukerFunksjon.diagnose}`,
    [VarigFunksjonsnedsettelse.UAVKLART]: 'Det er uavklart om innbygger har en varig sykdom, skade eller lyte.',
  }
  return tekst[brukerFunksjon.varigFunksjonsnedsettelse]
}

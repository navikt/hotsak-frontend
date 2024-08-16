import { Alert, Box, List } from '@navikt/ds-react'
import { Etikett } from '../../felleskomponenter/typografi.tsx'
import { Hast, Hasteårsak } from '../../types/types.internal.ts'
import { Fremhevet } from './Fremhevet.tsx'
import { HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'

export function Hastesak(props: { hast?: Hast }) {
  const { hast } = props
  if (!hast) return null
  const { årsaker, begrunnelse } = hast
  return (
    <>
      <Alert variant="warning" size="small" inline>
        Hast: formidler har markert saken som hast.
      </Alert>
      <Box paddingBlock="3">
        <HjelpemiddelGrid>
          <div />
          <Fremhevet>
            <Etikett>Årsak til at det haster</Etikett>
            <List size="small" headingTag="h2">
              {årsaker.map((årsak) => (
                <List.Item key={årsak}>
                  {tekstByHasteårsak[årsak]}
                  {årsak === Hasteårsak.ANNET && begrunnelse && (
                    <>
                      <br />
                      <>{begrunnelse}</>
                    </>
                  )}
                </List.Item>
              ))}
            </List>
          </Fremhevet>
        </HjelpemiddelGrid>
      </Box>
    </>
  )
}

const tekstByHasteårsak: Record<keyof typeof Hasteårsak, string> = {
  [Hasteårsak.UTVIKLING_AV_TRYKKSÅR]:
    'Det er stor fare for utvikling av trykksår, eller for å hindre videre utvikling av trykksår.',
  [Hasteårsak.TERMINALPLEIE]: 'Innbygger har behov for terminalpleie.',
  [Hasteårsak.UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES]: 'Utskriving fra sykehus som ikke kan planlegges.',
  [Hasteårsak.UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES_V2]:
    'Innbygger skal skrives ut fra sykehus uten at det var mulig å planlegge. Det er derfor behov for hjelpemidler til stell og pleie slik at utskrivingen kan gjennomføres.',
  [Hasteårsak.UTSKRIVING_FRA_SYKEHUS_SOM_IKKE_KAN_PLANLEGGES_V3]:
    'Innbygger skal skrives ut fra sykehus eller rehabilitering uten at det var mulig å planlegge. Det er derfor behov for hjelpemidler til stell og pleie slik at utskrivingen kan gjennomføres.',
  [Hasteårsak.RASK_FORVERRING_AV_ALVORLIG_DIAGNOSE]: 'Det har skjedd en rask forverring av en alvorlig diagnose.',
  [Hasteårsak.ANNET]: 'Annen årsak til plutselig oppstått behov på grunn av brukers helsesituasjon:',
}

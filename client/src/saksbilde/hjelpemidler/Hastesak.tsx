import { Hast, Hasteårsak } from '../../types/types.internal.ts'
import { Alert, Box, List } from '@navikt/ds-react'
import { Fremhev, HjelpemiddelGrid } from './HjelpemiddelGrid.tsx'

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
          <Fremhev />
          <List title="Årsak til at det haster" size="small" headingTag="h2">
            {årsaker
              .map((årsak) => {
                const tekst = tekstByHasteårsak[årsak]
                return årsak === Hasteårsak.ANNET && begrunnelse
                  ? `${tekst} Formidlers begrunnelse: ${begrunnelse}`
                  : tekst
              })
              .map((tekst) => (
                <List.Item key={tekst}>{tekst}</List.Item>
              ))}
          </List>
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
  [Hasteårsak.ANNET]: 'Annet, plutselig oppstått behov på grunn av brukers helsesituasjon.',
}

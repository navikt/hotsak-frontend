import { Hast, Hasteårsak, HasteårsakLabel } from '../../types/types.internal.ts'
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
          <List title="Årsak til at det haster" size="small">
            {årsaker
              .map((årsak) => {
                const label = HasteårsakLabel[årsak]
                return årsak === Hasteårsak.ANNET && begrunnelse ? `${label}: ${begrunnelse}` : label
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

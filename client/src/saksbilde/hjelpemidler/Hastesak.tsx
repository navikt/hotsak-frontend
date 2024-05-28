import { Hast, HasteårsakLabel } from '../../types/types.internal.ts'
import { Alert, Box, List } from '@navikt/ds-react'

export function Hastesak(props: { hast?: Hast }) {
  const { hast } = props
  if (!hast) return null
  return (
    <>
      <Alert variant="warning" size="small" inline>
        Hast: formidler har markert saken som hast.
      </Alert>
      <Box paddingBlock="3">
        <List title="Årsak til at det haster" size="small">
          {hast.årsaker
            .map((årsak) => HasteårsakLabel[årsak])
            .map((label) => (
              <List.Item key={label}>{label}</List.Item>
            ))}
        </List>
      </Box>
    </>
  )
}

import { Box, List } from '@navikt/ds-react'
import { SystemAlert } from '../../felleskomponenter/SystemAlert.tsx'
import { Hjelpemiddel } from '../../types/types.internal.ts'

export function OebsAlert(props: { hjelpemider: Hjelpemiddel[] }) {
  const { hjelpemider } = props

  return (
    <Box paddingBlock={'4 0'}>
      <SystemAlert>
        <List
          as="ul"
          size="small"
          title={`${hjelpemider.length > 1 ? 'Artiklene' : 'Artikkelen'} under finnes ikke i OeBS og blir derfor ikke 
            automatisk overført til SF:`}
        >
          {hjelpemider.map((hjelpemiddel) => {
            return (
              <List.Item
                key={hjelpemiddel.hmsArtNr}
              >{`${hjelpemiddel.hmsArtNr}: ${hjelpemiddel.artikkelnavn}`}</List.Item>
            )
          })}
        </List>
      </SystemAlert>
    </Box>
  )
}

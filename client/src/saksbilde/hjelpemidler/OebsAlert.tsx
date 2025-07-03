import { Box, List } from '@navikt/ds-react'
import { SystemAlert } from '../../felleskomponenter/SystemAlert.tsx'
import { Hjelpemiddel } from '../../types/types.internal.ts'

export function OebsAlert(props: { hjelpemidler: Hjelpemiddel[] }) {
  const { hjelpemidler } = props

  return (
    <Box paddingBlock={'4 0'}>
      <SystemAlert>
        <List
          as="ul"
          size="small"
          title={`${hjelpemidler.length > 1 ? 'Artiklene' : 'Artikkelen'} under finnes ikke i OeBS og blir derfor ikke 
            automatisk overført til SF:`}
        >
          {hjelpemidler.map((hjelpemiddel) => {
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

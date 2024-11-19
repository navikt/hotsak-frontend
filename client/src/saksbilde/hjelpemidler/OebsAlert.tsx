import { Box, List } from '@navikt/ds-react'
import { SystemAlert } from '../../felleskomponenter/SystemAlert.tsx'
import { Artikkel } from '../../types/types.internal.ts'

export function OebsAlert(props: { artikler: Artikkel[] }) {
  const { artikler } = props

  return (
    <Box paddingBlock={'4 0'}>
      <SystemAlert>
        <List
          as="ul"
          size="small"
          title={`${artikler.length > 1 ? 'Artiklene' : 'Artikkelen'} under finnes ikke i OeBS og blir derfor ikke 
            automatisk overført til SF:`}
        >
          {artikler.map((artikkel) => {
            return <List.Item key={artikkel.hmsArtNr}>{`${artikkel.hmsArtNr}: ${artikkel.artikkelnavn}`}</List.Item>
          })}
        </List>
      </SystemAlert>
    </Box>
  )
}

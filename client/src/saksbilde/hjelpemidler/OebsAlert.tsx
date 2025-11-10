import { Box, Heading, List } from '@navikt/ds-react'
import { SystemAlert } from '../../felleskomponenter/SystemAlert.tsx'
import { HjelpemiddelEndring } from './endreHjelpemiddel/endreProduktTypes.ts'

export function OebsAlert(props: { hjelpemidler: HjelpemiddelEndring[] }) {
  const { hjelpemidler } = props

  return (
    <Box paddingBlock={'4 0'}>
      <SystemAlert>
        <Heading
          level="2"
          size="xsmall"
          spacing
        >{`${hjelpemidler.length > 1 ? 'Artiklene' : 'Artikkelen'} under finnes ikke i OeBS og blir derfor ikke 
            automatisk overført til SF:`}</Heading>
        <List as="ul" size="small">
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

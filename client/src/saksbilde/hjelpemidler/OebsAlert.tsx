import { Alert, List, Box } from '@navikt/ds-react'

import { TextContainer } from '../../felleskomponenter/typografi.tsx'
import { type ArtikkellinjeSak } from '../../sak/sakTypes.ts'

export function OebsAlert(props: { hjelpemidler: ArtikkellinjeSak[] }) {
  const { hjelpemidler } = props

  return (
    <Alert variant="warning" size="small">
      <TextContainer>
        {`${hjelpemidler.length > 1 ? 'Artiklene' : 'Artikkelen'} under finnes ikke i OeBS og blir derfor ikke 
            automatisk overført til SF:`}
        <Box marginBlock="space-12" asChild>
          <List data-aksel-migrated-v8 as="ul" size="small">
            {hjelpemidler.map((hjelpemiddel) => {
              return (
                <List.Item
                  key={hjelpemiddel.hmsArtNr}
                >{`${hjelpemiddel.hmsArtNr} ${hjelpemiddel.artikkelnavn ? `: ${hjelpemiddel.artikkelnavn}` : ''}`}</List.Item>
              )
            })}
          </List>
        </Box>
      </TextContainer>
    </Alert>
  )
}

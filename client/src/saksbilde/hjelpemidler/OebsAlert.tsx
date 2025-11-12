import { Alert, List } from '@navikt/ds-react'
import { TextContainer } from '../../felleskomponenter/typografi.tsx'
import { HjelpemiddelEndring } from './endreHjelpemiddel/endreProduktTypes.ts'

export function OebsAlert(props: { hjelpemidler: HjelpemiddelEndring[] }) {
  const { hjelpemidler } = props

  return (
    <Alert variant="warning" size="small">
      <TextContainer>
        {`${hjelpemidler.length > 1 ? 'Artiklene' : 'Artikkelen'} under finnes ikke i OeBS og blir derfor ikke 
            automatisk overført til SF:`}
        <List as="ul" size="small">
          {hjelpemidler.map((hjelpemiddel) => {
            return (
              <List.Item
                key={hjelpemiddel.hmsArtNr}
              >{`${hjelpemiddel.hmsArtNr} ${hjelpemiddel.artikkelnavn ? `: ${hjelpemiddel.artikkelnavn}` : ''}`}</List.Item>
            )
          })}
        </List>
      </TextContainer>
    </Alert>
  )
}

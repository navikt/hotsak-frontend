import { Box, List } from '@navikt/ds-react'
import { TextContainer } from '../../../felleskomponenter/typografi'
import { Vilkår } from '../../../types/BehovsmeldingTypes'

export interface BrukerProps {
  vilkår: Vilkår[]
}

export function VilkårV2({ vilkår }: BrukerProps) {
  return (
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <TextContainer>
        <List data-aksel-migrated-v8 as="ul" size="small">
          {vilkår.map((vilkårItem) => (
            <List.Item key={vilkårItem.vilkårtype}>{vilkårItem.tekst.nb}</List.Item>
          ))}
        </List>
      </TextContainer>
    </Box>
  )
}

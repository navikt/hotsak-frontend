import { Alert, Box, VStack } from '@navikt/ds-react'
import { Brødtekst } from '../../felleskomponenter/typografi.tsx'
import { Artikkel } from '../../types/types.internal.ts'

export function OebsAlert(props: { artikler: Artikkel[] }) {
  const { artikler } = props

  return (
    <Box paddingBlock="2">
      <Alert variant="warning" size="small" fullWidth>
        <VStack gap="1">
          <Brødtekst>
            {`${artikler.length > 1 ? 'Artiklene' : 'Artikkelen'} under finnes ikke i OEBS og blir derfor ikke 
            automatisk overført til SF:`}
          </Brødtekst>
          <ul>
            {artikler.map((artikkel) => {
              return <li key={artikkel.hmsnr}>{`${artikkel.hmsnr}: ${artikkel.navn}`}</li>
            })}
          </ul>
        </VStack>
      </Alert>
    </Box>
  )
}

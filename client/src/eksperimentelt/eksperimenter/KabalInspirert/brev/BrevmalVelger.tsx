import { Box, Button, Heading, HStack, Select, VStack } from '@navikt/ds-react'
import { useState } from 'react'

export function BrevmalVelger() {
  const [brevmal, setBrevmal] = useState('')

  return (
    <Box.New padding="space-16">
      <Heading spacing level="2" size="xsmall">
        Brevmaler
      </Heading>
      <VStack gap="space-36">
        <Select
          size="small"
          label="Velg type brev"
          value={brevmal}
          onChange={(e) => setBrevmal(e.target.value)}
          style={{ width: 'auto' }}
        >
          <option value="">- Velg brevmal -</option>
          <option value="vedtak">Vedtaksbrev</option>
          <option value="innhente">Innhente opplysninger</option>
          <option value="svartid">Svartidsbrev</option>
          <option value="henlegg">Henleggelsesbrev</option>
        </Select>
        {brevmal === 'vedtak' && (
          <Select size="small" label="Velg type vedtaksbrev" style={{ width: 'auto' }}>
            <option value="">- Velg vedtaksbrev -</option>
            <option value="standard">Innvilg brev</option>
            <option value="enkeltvedtak">Avslagsbrev</option>
            <option value="delvisInnvilg">Delvis innvilgelse</option>
          </Select>
        )}
        <HStack gap="space-16">
          <Button size="small" variant="primary">
            OpprettBrev
          </Button>
          <Button size="small" variant="secondary">
            Avbryt
          </Button>
        </HStack>
      </VStack>
    </Box.New>
  )
}

import { Box, Tag, VStack } from '@navikt/ds-react'
import { Etikett, Tekst } from '../../../felleskomponenter/typografi'
import { BehandlingsutfallHenleggelse, Henleggelsesårsak } from './behandlingTyper'

interface HenleggLesevisningProps {
  utfall: BehandlingsutfallHenleggelse
}

const årsakLabels: Record<Henleggelsesårsak, string> = {
  [Henleggelsesårsak.SØKNAD_TRUKKET]: 'Bruker ønsker å trekke søknaden',
  [Henleggelsesårsak.TRUKKET_AV_BEGRUNNER]: 'Begrunner ønsker å trekke søknaden',
  [Henleggelsesårsak.FLERE_SØKNADER_SAMME_BEHOV]: 'Det er sendt inn flere søknader på brukeren om samme behov',
  [Henleggelsesårsak.BRUKER_ER_DØD]: 'Bruker er død',
  [Henleggelsesårsak.DUPLIKAT]: 'Duplikat',
  [Henleggelsesårsak.FEIL_BRUKER]: 'Feil bruker',
  [Henleggelsesårsak.ANNET]: 'Annet',
}

export function HenleggLesevisning({ utfall }: HenleggLesevisningProps) {
  return (
    <Box borderWidth="1" borderRadius="8" borderColor="neutral-subtle" padding="space-12">
      <Tag size="small" variant="error-moderate">
        Henlagt
      </Tag>
      <VStack gap="space-8" marginBlock="space-16 space-0">
        {utfall.utfall && (
          <div>
            <Etikett>Valgt årsak:</Etikett>
            <Tekst>{årsakLabels[utfall.utfall]}</Tekst>
          </div>
        )}
        {utfall.begrunnelse && (
          <div>
            <Etikett>Saksbehandlers begrunnelse:</Etikett>
            <Tekst>"{utfall.begrunnelse}"</Tekst>
          </div>
        )}
      </VStack>
    </Box>
  )
}

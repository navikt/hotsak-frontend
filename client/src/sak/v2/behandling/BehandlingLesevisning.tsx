import { Box, Heading, InlineMessage, VStack } from '@navikt/ds-react'

import { Brevstatus } from '../../../brev/brevTyper.ts'
import { useBrevMetadata } from '../../../brev/useBrevMetadata.ts'
import { TextContainer } from '../../../felleskomponenter/typografi.tsx'
import { isBehandlingsutfallHenleggelse, isBehandlingsutfallVedtak, type Behandling } from './behandlingTyper.ts'
import { VisBrevKnapp } from './VisBrevKnapp.tsx'

export interface BehandlingLesevisningProps {
  behandling?: Behandling
}

export function BehandlingLesevisning({ behandling }: BehandlingLesevisningProps) {
  const { gjeldendeBrev: brevMetadata, harBrevISak } = useBrevMetadata()

  const vedtaksresultat = isBehandlingsutfallVedtak(behandling?.utfall) ? behandling.utfall.utfall : undefined
  const erHenleggelse = isBehandlingsutfallHenleggelse(behandling?.utfall)

  return (
    <VStack gap="space-16" paddingInline="space-0 space-8">
      {(vedtaksresultat || erHenleggelse) && (
        <TextContainer>
          <Box paddingInline="space-8 space-0">
            <VStack gap="space-12">
              {harBrevISak && (
                <Heading level="2" size="xsmall">
                  {erHenleggelse ? 'Brev' : 'Vedtaksbrev'}
                </Heading>
              )}

              {(brevMetadata?.status === Brevstatus.UTBOKS || brevMetadata?.status === Brevstatus.FERDIGSTILT) && (
                <InlineMessage status="info" size="small">
                  Brev lagt til utsending - sendes neste virkedag
                </InlineMessage>
              )}

              {harBrevISak && <VisBrevKnapp erHenleggelse={erHenleggelse} />}
            </VStack>
          </Box>
        </TextContainer>
      )}
    </VStack>
  )
}

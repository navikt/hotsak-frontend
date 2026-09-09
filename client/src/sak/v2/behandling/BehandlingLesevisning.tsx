import { Box, Heading, InlineMessage, VStack } from '@navikt/ds-react'

import { isVedtaksbrev } from '../../../brev/brevSelectors.ts'
import { Brevstatus } from '../../../brev/brevTyper.ts'
import { useBrevForSak } from '../../../brev/useBrev.ts'
import { TextContainer } from '../../../felleskomponenter/typografi.tsx'
import { isBehandlingsutfallHenleggelse, isBehandlingsutfallVedtak, type Behandling } from './behandlingTyper.ts'
import { VisBrevKnapp } from './VisBrevKnapp.tsx'

export interface BehandlingLesevisningProps {
  behandling?: Behandling
}

export function BehandlingLesevisning({ behandling }: BehandlingLesevisningProps) {
  const { finnBrev, harVedtaksbrev } = useBrevForSak(behandling?.sakId)
  const brev = finnBrev(isVedtaksbrev)

  const vedtaksresultat = isBehandlingsutfallVedtak(behandling?.utfall) ? behandling.utfall.utfall : undefined
  const erHenleggelse = isBehandlingsutfallHenleggelse(behandling?.utfall)

  return (
    <VStack gap="space-16" paddingInline="space-0 space-8">
      {(vedtaksresultat || erHenleggelse) && (
        <TextContainer>
          <Box paddingInline="space-8 space-0">
            <VStack gap="space-12">
              {harVedtaksbrev && (
                <Heading level="2" size="xsmall">
                  {erHenleggelse ? 'Brev' : 'Vedtaksbrev'}
                </Heading>
              )}

              {(brev?.brevstatus === Brevstatus.TIL_DISTRIBUSJON || brev?.brevstatus === Brevstatus.FERDIGSTILT) && (
                <InlineMessage status="info" size="small">
                  Brev lagt til utsending - sendes neste virkedag
                </InlineMessage>
              )}

              {harVedtaksbrev && <VisBrevKnapp erHenleggelse={erHenleggelse} />}
            </VStack>
          </Box>
        </TextContainer>
      )}
    </VStack>
  )
}

import { Box, Heading, InlineMessage, VStack } from '@navikt/ds-react'

import { type Brev, Brevstatus } from '../../../brev/brevTyper.ts'
import { useBrevForSak } from '../../../brev/useBrev.ts'
import { useUtsendingsInfo } from '../../../brev/useUtsendingsInfo.ts'
import { Tekst, TextContainer } from '../../../felleskomponenter/typografi.tsx'
import { Saksvarsler } from '../../../saksbilde/bestillingsordning/Saksvarsler.tsx'
import { useSøknadsVarsler } from '../../../saksbilde/varsler/useVarsler.tsx'
import { formaterTidsstempelLang } from '../../../utils/dato.ts'
import { BehandlingsutfallTag } from '../BehandlingsutfallTag.tsx'
import classes from './BehandlingPanel.module.css'
import {
  type FerdigstiltBehandling,
  isBehandlingsutfallHenleggelse,
  isBehandlingsutfallVedtak,
  VedtaksResultat,
} from './behandlingTyper.ts'
import { HenleggLesevisning } from './HenleggLesevisning.tsx'
import { VisBrevKnapp } from './VisBrevKnapp.tsx'

export interface BehandlingFerdigstiltProps {
  behandling: FerdigstiltBehandling
}

export function BehandlingFerdigstilt({ behandling }: BehandlingFerdigstiltProps) {
  const { brevForSak, harBrev } = useBrevForSak(behandling.sakId)
  const { varsler, harVarsler } = useSøknadsVarsler()
  const { datoEkspedert } = useUtsendingsInfo()

  const vedtaksresultat = isBehandlingsutfallVedtak(behandling.utfall) ? behandling.utfall.utfall : undefined
  const henleggelseUtfall = isBehandlingsutfallHenleggelse(behandling.utfall) ? behandling.utfall : undefined
  const erHenleggelse = henleggelseUtfall != null

  return (
    <VStack gap="space-16" paddingInline="space-0 space-8">
      <VedtaksResultatVisning behandling={behandling} />

      {(vedtaksresultat || erHenleggelse) && (
        <TextContainer>
          <Box paddingInline="space-8 space-0">
            <VStack gap="space-12">
              {henleggelseUtfall && <HenleggLesevisning utfall={henleggelseUtfall} />}

              {harBrev && (
                <Heading level="2" size="xsmall">
                  {erHenleggelse ? 'Brev' : 'Vedtaksbrev'}
                </Heading>
              )}

              <BrevSendtStatus brev={brevForSak?.brev[0]} datoEkspedert={datoEkspedert} erHenleggelse={erHenleggelse} />

              {!harBrev && vedtaksresultat === VedtaksResultat.INNVILGET && (
                <InlineMessage status="info" size="small">
                  Saken er innvilget uten å sende brev
                </InlineMessage>
              )}

              {harBrev && <VisBrevKnapp erHenleggelse={erHenleggelse} />}
            </VStack>
          </Box>
        </TextContainer>
      )}

      {(vedtaksresultat === VedtaksResultat.INNVILGET || vedtaksresultat === VedtaksResultat.DELVIS_INNVILGET) &&
        harVarsler && (
          <>
            <Heading level="2" size="xsmall">
              Videre behandling i OeBS
            </Heading>
            <Tekst>Saken kan nå tas videre i OeBS</Tekst>
            <div className={classes.saksvarsler}>
              <Saksvarsler varsler={varsler} />
            </div>
          </>
        )}
    </VStack>
  )
}

function VedtaksResultatVisning({ behandling }: { behandling: FerdigstiltBehandling }) {
  if (!behandling.utfall) {
    return null
  }

  const header = (() => {
    switch (behandling.utfall.type) {
      case 'HENLEGGELSE':
        return 'Henleggelsesresultat'
      case 'VEDTAK':
        return 'Vedtaksresultat'
      default:
        return 'Resultat'
    }
  })()

  return (
    <VStack gap="space-8">
      <Heading size="xsmall" level="2" spacing={false}>
        {header}
      </Heading>
      <div>{<BehandlingsutfallTag utfall={behandling.utfall.utfall} />}</div>
    </VStack>
  )
}

function BrevSendtStatus({
  brev,
  datoEkspedert,
  erHenleggelse,
}: {
  brev?: Brev
  datoEkspedert?: string | null
  erHenleggelse: boolean
}) {
  if (!brev) return null

  if (brev.brevstatus === Brevstatus.TIL_DISTRIBUSJON || brev.brevstatus === Brevstatus.FERDIGSTILT) {
    return (
      <InlineMessage status="info" size="small">
        Brev lagt til utsending - sendes neste virkedag
      </InlineMessage>
    )
  }

  // fixme -> håndter at det kan være flere distribusjoner
  if (brev.brevstatus === Brevstatus.DISTRIBUERT) {
    return (
      <InlineMessage status="info" size="small">
        {erHenleggelse ? 'Brevet ble sendt til bruker den ' : 'Vedtaksbrevet ble sendt til bruker den '}
        {datoEkspedert
          ? formaterTidsstempelLang(datoEkspedert)
          : formaterTidsstempelLang(brev.distribusjon[0]?.distribuert)}
      </InlineMessage>
    )
  }

  return null
}

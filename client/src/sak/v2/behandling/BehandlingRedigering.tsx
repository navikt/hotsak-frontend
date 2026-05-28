import { Box, Button, Heading, HelpText, HStack, InlineMessage, Select, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { SlettBrevModal } from '../../../brev/SlettBrevModal.tsx'
import { useBrevMetadata } from '../../../brev/useBrevMetadata.ts'
import { useToast } from '../../../felleskomponenter/toast/useToast'
import { TextContainer } from '../../../felleskomponenter/typografi.tsx'
import { useMiljø } from '../../../utils/useMiljø.ts'
import { useClosePanel, useSetPanelVisibility } from '../paneler/usePanelHooks.ts'
import { useSakContext } from '../SakV2ContextType.ts'
import classes from './BehandlingPanel.module.css'
import {
  Gjenstående,
  Henleggelsesårsak,
  isBehandlingsutfallHenleggelse,
  isBehandlingsutfallVedtak,
  UtfallLåst,
  VedtaksResultat,
  type Behandling,
} from './behandlingTyper.ts'
import { HenleggForm } from './HenleggForm.tsx'
import { useBehandlingActions } from './useBehandlingActions.ts'
import { VisBrevKnapp } from './VisBrevKnapp.tsx'

export interface BehandlingRedigeringProps {
  behandling?: Behandling
}

export function BehandlingRedigering({ behandling }: BehandlingRedigeringProps) {
  const { setOpprettBrevKlikket, henleggFormRef } = useSakContext()
  const closePanel = useClosePanel('brevpanel')
  const setBrevpanelVisibility = useSetPanelVisibility('brevpanel')
  const { harBrevISak } = useBrevMetadata()
  const { ferdigstillBehandling, lagreBehandling } = useBehandlingActions()
  const { showSuccessToast } = useToast()

  const vedtaksresultat = isBehandlingsutfallVedtak(behandling?.utfall) ? behandling.utfall.utfall : undefined
  const henleggelseUtfall = isBehandlingsutfallHenleggelse(behandling?.utfall) ? behandling.utfall : undefined
  const erHenleggelse = henleggelseUtfall != null
  const gjenstående = behandling?.gjenstående || []

  const harBrevutkast = !!behandling?.utfallLåst?.includes(UtfallLåst.HAR_VEDTAKSBREV)
  const kanOppretteBrev = !harBrevutkast
  const brevutkastFerdigstilt = harBrevutkast && !gjenstående.includes(Gjenstående.BREV_IKKE_FERDIGSTILT)

  const henlegg = async () => {
    await ferdigstillBehandling({})
    if (!harBrevISak) closePanel()
    showSuccessToast('Saken er henlagt')
  }

  const lagreHenleggelse = async (utfall: Henleggelsesårsak | undefined, begrunnelse?: string) => {
    await lagreBehandling({ type: 'HENLEGGELSE', utfall, begrunnelse })
  }

  return (
    <VStack gap="space-16" paddingInline="space-0 space-8">
      <VedtaksResultatVelger utfall={vedtaksresultat} erHenleggelse={erHenleggelse} harBrevutkast={harBrevutkast} />

      {(vedtaksresultat || erHenleggelse) && (
        <TextContainer>
          <Box paddingInline="space-8 space-0">
            <VStack gap="space-12">
              {erHenleggelse && (
                <HenleggForm
                  ref={henleggFormRef}
                  onHenleggelse={henlegg}
                  onSave={lagreHenleggelse}
                  defaultÅrsak={henleggelseUtfall.utfall}
                  defaultBegrunnelse={henleggelseUtfall.begrunnelse}
                />
              )}

              <Heading level="2" size="xsmall">
                {erHenleggelse ? 'Brev' : 'Vedtaksbrev'}
              </Heading>

              {!harBrevutkast && !erHenleggelse && <UnderrettBruker vedtaksresultat={vedtaksresultat} />}

              {!harBrevutkast && erHenleggelse && (
                <TextContainer>
                  <InlineMessage status="info" size="small">
                    {gjenstående.includes(Gjenstående.BREV_MANGLER)
                      ? 'Du må sende brev om henleggelsen når søknaden er trukket av brukeren.'
                      : 'Du må selv vurdere om det er behov for å sende brev om henleggelsen.'}
                  </InlineMessage>
                </TextContainer>
              )}

              {kanOppretteBrev && (
                <div>
                  <Button
                    variant={
                      vedtaksresultat === VedtaksResultat.INNVILGET ||
                      henleggelseUtfall?.utfall !== Henleggelsesårsak.SØKNAD_TRUKKET
                        ? 'secondary'
                        : 'primary'
                    }
                    size="small"
                    onClick={() => {
                      setBrevpanelVisibility(true)
                      setOpprettBrevKlikket(true)
                    }}
                  >
                    {erHenleggelse ? 'Opprett brev' : 'Opprett vedtaksbrev'}
                  </Button>
                </div>
              )}

              {harBrevISak && <VisBrevKnapp erHenleggelse={erHenleggelse} />}

              {brevutkastFerdigstilt && (
                <InlineMessage status="info" size="small">
                  Du har markert brevet som ferdigstilt, og kan gå videre til å fatte vedtaket. Brevet blir lagt til
                  utsending etter at vedtaket er fattet.
                </InlineMessage>
              )}

              {harBrevutkast && !brevutkastFerdigstilt && (
                <InlineMessage status="info" size="small">
                  Ferdigstill utkastet i brevpanelet. Brevet blir lagt til utsending etter at vedtaket er fattet.
                </InlineMessage>
              )}
            </VStack>
          </Box>
        </TextContainer>
      )}
    </VStack>
  )
}

function UnderrettBruker({ vedtaksresultat }: { vedtaksresultat?: VedtaksResultat }) {
  if (!vedtaksresultat) {
    return null
  }

  let tekst: string
  switch (vedtaksresultat) {
    case VedtaksResultat.INNVILGET:
      tekst = 'Du må selv vurdere om det er behov for å sende vedtaksbrev.'
      break
    case VedtaksResultat.DELVIS_INNVILGET:
      tekst = 'Du må sende vedtaksbrev ved delvis innvilgelse.'
      break
    case VedtaksResultat.AVSLÅTT:
      tekst = 'Du må sende vedtaksbrev ved avslag.'
      break
    default:
      return null
  }

  return (
    <TextContainer>
      <InlineMessage status="info" size="small">
        {tekst}
      </InlineMessage>
    </TextContainer>
  )
}

function VedtaksResultatVelger({
  utfall,
  erHenleggelse,
  harBrevutkast,
}: {
  utfall?: VedtaksResultat
  erHenleggelse: boolean
  harBrevutkast: boolean
}) {
  const { lagreBehandling } = useBehandlingActions()
  const [visSlettBrevutkastModal, setVisSlettBrevutkastModal] = useState(false)
  const { erProd } = useMiljø()

  const HENLEGGELSE_VALUE = 'HENLEGGELSE'
  const currentValue = erHenleggelse ? HENLEGGELSE_VALUE : (utfall ?? '')

  return (
    <>
      <HStack gap="space-2" paddingInline="space-8 space-0">
        <Heading size="xsmall" level="2" spacing={false}>
          Vurderingen din
        </Heading>
        <HelpText title="Vurderingsinformasjon">
          Vurder om søknaden skal innvilges, delvis innvilges eller avslås. Vurderingen blir ikke synlig for bruker før
          etter at vedtaket er fattet.
        </HelpText>
      </HStack>
      <VStack paddingInline="space-8 space-0" gap="space-12">
        <Select
          size="small"
          label="Resultat"
          readOnly={harBrevutkast}
          className={classes.selectAuto}
          value={currentValue}
          onChange={async (e) => {
            const value = e.target.value
            if (value === currentValue) {
              return
            }
            if (value === HENLEGGELSE_VALUE) {
              await lagreBehandling({ type: HENLEGGELSE_VALUE, utfall: undefined })
            } else if (value !== '') {
              await lagreBehandling({ utfall: value as VedtaksResultat, type: 'VEDTAK' })
            } else {
              await lagreBehandling(undefined)
            }
          }}
        >
          <option value="">-- Velg resultat --</option>
          <option value={VedtaksResultat.INNVILGET}>Innvilget</option>
          <option value={VedtaksResultat.DELVIS_INNVILGET}>Delvis innvilget</option>
          <option value={VedtaksResultat.AVSLÅTT}>Avslått</option>
          {!erProd && <option value={HENLEGGELSE_VALUE}>Henlagt</option>}
        </Select>
        {harBrevutkast && (
          <div>
            <Button variant="tertiary" size="small" onClick={() => setVisSlettBrevutkastModal(true)}>
              Endre vurdering
            </Button>
          </div>
        )}
      </VStack>
      <SlettBrevModal
        open={visSlettBrevutkastModal}
        onClose={() => setVisSlettBrevutkastModal(false)}
        heading="Du må slette brevutkastet ditt før du kan endre resultatet"
        tekst="Du har begynt på et utkast til vedtaksbrev. Dette må slettes før du kan endre resultatet. Hvis du sletter
        brevet, kan det ikke gjenopprettes."
        width="700px"
      />
    </>
  )
}

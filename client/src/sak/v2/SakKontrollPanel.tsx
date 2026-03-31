import { Button, Chips, HStack } from '@navikt/ds-react'
import clsx from 'clsx'
import { useOppgaveContext } from '../../oppgave/OppgaveContext'
import { SaksbildeMenu } from '../../saksbilde/SaksbildeMenu'
import { useNotater } from '../../saksbilde/høyrekolonne/notat/useNotater'
import { useSakId } from '../../saksbilde/useSak'
import globalStyles from '../../styles/shared.module.css'
import classes from './SakKontrollPanel.module.css'
import { AngringLåst, GjenståendeOverfør, UtfallLåst } from './behandling/behandlingTyper'
import { useBehandling } from './behandling/useBehandling'
import { usePanel, useTogglePanel } from './paneler/usePanelHooks'
import { useMiljø } from '../../utils/useMiljø'
import { useState } from 'react'
import { AngreVedtakModal } from './angreVedtak/AngreVedtakModal'

export const SakKontrollPanel = () => {
  const sakId = useSakId()
  const behandlingPanel = usePanel('behandlingspanel')
  const brevKolonne = usePanel('brevpanel')
  const søknadPanel = usePanel('behovsmeldingspanel')
  const oebsPanel = usePanel('kontaktinformasjonpanel')
  const sidePanel = usePanel('sidebarpanel')
  const toggleBehandlingPanel = useTogglePanel('behandlingspanel')
  const toggleBrevKolonne = useTogglePanel('brevpanel')
  const toggleSøknadPanel = useTogglePanel('behovsmeldingspanel')
  const toggleOebsPanel = useTogglePanel('kontaktinformasjonpanel')
  const toggleSidePanel = useTogglePanel('sidebarpanel')
  const { isOppgaveContext } = useOppgaveContext()
  const { gjeldendeBehandling } = useBehandling()
  const { harUtkast: harNotatUtkast } = useNotater(sakId)
  const { erDev } = useMiljø()
  const [angreVedtakModalOpen, setAngreVedtakModalOpen] = useState(false)

  const gjenståendeForOverføringTilGosys = gjeldendeBehandling?.operasjoner.overfør.gjenstående || []

  if (harNotatUtkast && !gjenståendeForOverføringTilGosys.includes(GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES)) {
    gjenståendeForOverføringTilGosys.push(GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES)
  }

  return (
    <>
      <HStack gap="space-16" align="center" className={`${globalStyles.container} ${classes.togglePanel}`} width="100%">
        <Chips size="small">
          <ToggleKnapp selected={behandlingPanel.visible} onToggle={() => toggleBehandlingPanel()}>
            Behandle sak
          </ToggleKnapp>
          <ToggleKnapp selected={brevKolonne.visible} onToggle={() => toggleBrevKolonne()}>
            Brev
          </ToggleKnapp>
          <ToggleKnapp selected={søknadPanel.visible} onToggle={() => toggleSøknadPanel()}>
            Søknad
          </ToggleKnapp>
          <ToggleKnapp selected={oebsPanel.visible} onToggle={() => toggleOebsPanel()}>
            Kontaktinformasjon
          </ToggleKnapp>
          <ToggleKnapp selected={sidePanel.visible} onToggle={() => toggleSidePanel()}>
            Utlån, notater og historikk
          </ToggleKnapp>
        </Chips>
        {isOppgaveContext && (
          <SaksbildeMenu
            spørreundersøkelseId="sak_overført_gosys_v1"
            gjenståendeFørOverføring={gjenståendeForOverføringTilGosys}
          />
        )}
        {gjeldendeBehandling?.utfallLåst?.includes(UtfallLåst.MIDLERTIDIG_FERDIGSTILT) &&
          !gjeldendeBehandling.operasjoner.angreVedtak.angringLåst.includes(AngringLåst.ANGRE_TID_UTLØPT) &&
          erDev && (
            <Button
              variant="tertiary"
              size="small"
              data-color="danger"
              style={{
                marginLeft: 'auto',
                marginRight: '1rem',
              }}
              onClick={() => setAngreVedtakModalOpen(true)}
            >
              Angre vedtak
            </Button>
          )}
      </HStack>
      <AngreVedtakModal open={angreVedtakModalOpen} onClose={() => setAngreVedtakModalOpen(false)} />
    </>
  )
}

const ToggleKnapp = ({ onToggle: onToggle, children, selected }: ToggleKnappProps) => {
  return (
    <Chips.Toggle
      data-color="neutral"
      key={children}
      selected={selected}
      onClick={onToggle}
      className={clsx(selected && classes.extraNeutral)}
    >
      {children}
    </Chips.Toggle>
  )
}

interface ToggleKnappProps {
  onToggle: () => void
  selected: boolean
  children: string
}

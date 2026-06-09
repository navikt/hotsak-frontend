import { Chips, HStack } from '@navikt/ds-react'
import clsx from 'clsx'

import { useOppgaveContext } from '../../oppgave/OppgaveContext'
import { SaksbildeMenu } from '../../saksbilde/SaksbildeMenu'
import { useSakId } from '../../saksbilde/useSak'
import { useSaksregler } from '../../saksregler/useSaksregler'
import globalStyles from '../../styles/shared.module.css'
import { useMiljø } from '../../utils/useMiljø'
import { useNotater } from '../notat/useNotater'
import { GjenståendeOverfør } from './behandling/behandlingTyper'
import { useBehandling } from './behandling/useBehandling'
import { usePanel, useTogglePanel } from './paneler/usePanelHooks'
import classes from './SakKontrollPanel.module.css'

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
  const { erBestilling } = useSaksregler()
  const { erProd } = useMiljø()

  const gjenståendeForOverføringTilGosys = gjeldendeBehandling?.operasjoner.overfør.gjenstående || []

  if (harNotatUtkast && !gjenståendeForOverføringTilGosys.includes(GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES)) {
    gjenståendeForOverføringTilGosys.push(GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES)
  }

  return (
    <>
      <HStack gap="space-16" align="center" className={`${globalStyles.container} ${classes.togglePanel}`} width="100%">
        <Chips size="small">
          {!erBestilling && (
            <ToggleKnapp selected={behandlingPanel.visible} onToggle={() => toggleBehandlingPanel()}>
              Behandle sak
            </ToggleKnapp>
          )}
          {!erBestilling && (
            <ToggleKnapp selected={brevKolonne.visible} onToggle={() => toggleBrevKolonne()}>
              Brev
            </ToggleKnapp>
          )}
          <ToggleKnapp selected={søknadPanel.visible} onToggle={() => toggleSøknadPanel()}>
            {erBestilling ? 'Bestilling' : 'Søknad'}
          </ToggleKnapp>
          <ToggleKnapp selected={oebsPanel.visible} onToggle={() => toggleOebsPanel()}>
            Kontaktinformasjon
          </ToggleKnapp>
          {erProd && (
            <ToggleKnapp selected={sidePanel.visible} onToggle={() => toggleSidePanel()}>
              Utlån, notater og historikk
            </ToggleKnapp>
          )}
        </Chips>
        {isOppgaveContext && (
          <SaksbildeMenu
            spørreundersøkelseId="sak_overført_gosys_v1"
            gjenståendeFørOverføring={gjenståendeForOverføringTilGosys}
          />
        )}
      </HStack>
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

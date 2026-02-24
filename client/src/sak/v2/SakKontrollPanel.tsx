import { Chips, HStack } from '@navikt/ds-react'
import clsx from 'clsx'
import { useOppgaveContext } from '../../oppgave/OppgaveContext'
import { SaksbildeMenu } from '../../saksbilde/SaksbildeMenu'
import globalStyles from '../../styles/shared.module.css'
import classes from './SakKontrollPanel.module.css'
import { usePanel, useTogglePanel } from './paneler/usePanelHooks'
import { useBehandling } from './behandling/useBehandling'
import { useNotater } from '../../saksbilde/høyrekolonne/notat/useNotater'
import { useSakId } from '../../saksbilde/useSak'
import { GjenståendeOverfør } from './behandling/behandlingTyper'

export const SakKontrollPanel = () => {
  const sakId = useSakId()
  const behandlingPanel = usePanel('behandlingspanel')
  const brevKolonne = usePanel('brevpanel')
  const søknadPanel = usePanel('behovsmeldingspanel')
  const sidePanel = usePanel('sidebarpanel')
  const toggleBehandlingPanel = useTogglePanel('behandlingspanel')
  const toggleBrevKolonne = useTogglePanel('brevpanel')
  const toggleSøknadPanel = useTogglePanel('behovsmeldingspanel')
  const toggleSidePanel = useTogglePanel('sidebarpanel')
  const { isOppgaveContext } = useOppgaveContext()
  const { gjeldendeBehandling } = useBehandling()
  const { harUtkast: harNotatUtkast } = useNotater(sakId)

  const gjenståendeForOverføringTilGosys = gjeldendeBehandling?.operasjoner.overfør.gjenstående || []
  console.log('Gjeldende behandling', gjeldendeBehandling, 'gjenstående', gjenståendeForOverføringTilGosys)

  if (harNotatUtkast && !gjenståendeForOverføringTilGosys.includes(GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES)) {
    gjenståendeForOverføringTilGosys.push(GjenståendeOverfør.NOTATUTKAST_MÅ_SLETTES)
  }

  return (
    <HStack gap="space-16" align="center" className={`${globalStyles.container} ${classes.togglePanel}`} width="100%">
      <Chips size="small">
        <ToggleKnapp selected={behandlingPanel.visible} onToggle={() => toggleBehandlingPanel()}>
          Behandle
        </ToggleKnapp>
        <ToggleKnapp selected={brevKolonne.visible} onToggle={() => toggleBrevKolonne()}>
          Brev
        </ToggleKnapp>
        <ToggleKnapp selected={søknadPanel.visible} onToggle={() => toggleSøknadPanel()}>
          Søknad
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
    </HStack>
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

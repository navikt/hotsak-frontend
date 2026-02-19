import { Chips, HStack } from '@navikt/ds-react'
import clsx from 'clsx'
import { useOppgaveContext } from '../../oppgave/OppgaveContext'
import { SaksbildeMenu } from '../../saksbilde/SaksbildeMenu'
import globalStyles from '../../styles/shared.module.css'
import classes from './SakKontrollPanel.module.css'
import { usePanel, useTogglePanel } from './SakProvider'

export const SakKontrollPanel = () => {
  const behandlingPanel = usePanel('behandlingspanel')
  const brevKolonne = usePanel('brevpanel')
  const søknadPanel = usePanel('behovsmeldingspanel')
  const sidePanel = usePanel('sidebarpanel')
  const toggleBehandlingPanel = useTogglePanel('behandlingspanel')
  const toggleBrevKolonne = useTogglePanel('brevpanel')
  const toggleSøknadPanel = useTogglePanel('behovsmeldingspanel')
  const toggleSidePanel = useTogglePanel('sidebarpanel')
  const { isOppgaveContext } = useOppgaveContext()

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
      {isOppgaveContext && <SaksbildeMenu spørreundersøkelseId="sak_overført_gosys_v1" />}
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

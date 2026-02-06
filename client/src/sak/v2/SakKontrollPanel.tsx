import { Chips, HStack } from '@navikt/ds-react'
import clsx from 'clsx'
import { useOppgaveContext } from '../../oppgave/OppgaveContext'
import { SaksbildeMenu } from '../../saksbilde/SaksbildeMenu'
import globalStyles from '../../styles/shared.module.css'
import classes from './SakKontrollPanel.module.css'
import { useSaksbehandlingEksperimentContext } from './SakProvider'

export const SakKontrollPanel = () => {
  const {
    sidePanel,
    setSidePanel,
    søknadPanel,
    setSøknadPanel,
    behandlingPanel,
    setBehandlingPanel,
    brevKolonne,
    setBrevKolonne,
  } = useSaksbehandlingEksperimentContext()
  const { isOppgaveContext } = useOppgaveContext()

  return (
    <HStack gap="space-16" align="center" className={`${globalStyles.container} ${classes.togglePanel}`} width="100%">
      <Chips size="small">
        <ToggleKnapp selected={sidePanel} onToggle={() => setSidePanel(!sidePanel)}>
          Utlån, notater og historikk
        </ToggleKnapp>
        <ToggleKnapp selected={søknadPanel} onToggle={() => setSøknadPanel(!søknadPanel)}>
          Søknad
        </ToggleKnapp>
        <ToggleKnapp selected={behandlingPanel} onToggle={() => setBehandlingPanel(!behandlingPanel)}>
          Behandle
        </ToggleKnapp>
        <ToggleKnapp selected={brevKolonne} onToggle={() => setBrevKolonne(!brevKolonne)}>
          Brev
        </ToggleKnapp>
      </Chips>
      {isOppgaveContext && <SaksbildeMenu spørreundersøkelseId="sak_overført_gosys_v1" />}
    </HStack>
  )
}

const ToggleKnapp = ({ onToggle: onToggle, children, selected }: ToggleKnappProps) => {
  return (
    <Chips.Toggle
      key={children}
      selected={selected}
      onClick={onToggle}
      variant="neutral"
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

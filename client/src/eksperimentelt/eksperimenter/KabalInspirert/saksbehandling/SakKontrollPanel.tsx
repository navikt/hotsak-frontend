import { HStack, Switch } from '@navikt/ds-react'

import globalStyles from '../../../../styles/shared.module.css'
import { SakMenyEksperiment } from './SakMenyEksperiment'
import styles from './SaksbehandlingEksperiment.module.css'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'

export const SakKontrollPanel = () => {
  const {
    venstrePanel,
    setVenstrePanel,
    søknadPanel,
    setSøknadPanel,
    vilkårPanel,
    setVilkårPanel,
    brevKolonne,
    setBrevKolonne,
  } = useSaksbehandlingEksperimentContext()

  return (
    <HStack gap="space-16" align="center" className={`${globalStyles.container} ${styles.togglePanel}`} width="100%">
      <ToggleKnapp checked={venstrePanel} onToggle={() => setVenstrePanel(!venstrePanel)}>
        Venstrepanel
      </ToggleKnapp>
      <ToggleKnapp checked={søknadPanel} onToggle={() => setSøknadPanel(!søknadPanel)}>
        Søknad
      </ToggleKnapp>
      <ToggleKnapp checked={vilkårPanel} onToggle={() => setVilkårPanel(!vilkårPanel)}>
        Vilkår
      </ToggleKnapp>
      <ToggleKnapp checked={brevKolonne} onToggle={() => setBrevKolonne(!brevKolonne)}>
        Brev
      </ToggleKnapp>
      <SakMenyEksperiment spørreundersøkelseId="sak_overført_gosys_v1" />
    </HStack>
  )
}

const ToggleKnapp = ({ onToggle: onToggle, children, checked }: ToggleKnappProps) => {
  return (
    <Switch checked={checked} size="small" onChange={onToggle}>
      {children}
    </Switch>
  )
}

interface ToggleKnappProps {
  onToggle: () => void
  checked: boolean
  children: string
}

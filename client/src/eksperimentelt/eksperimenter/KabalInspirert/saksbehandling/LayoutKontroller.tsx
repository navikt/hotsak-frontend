import { HStack, Switch } from '@navikt/ds-react'

import globalStyles from '../../../../styles/shared.module.css'
import styles from './SaksbehandlingEksperiment.module.css'
import { useSaksbehandlingEksperimentContext } from './SaksbehandlingEksperimentProvider'

export const LayoutKontroller = () => {
  const { venstreKolonne, setVenstreKolonne, midtreKolonne, setMidtreKolonne, høyreKolonne, setHøyreKolonne } =
    useSaksbehandlingEksperimentContext()

  return (
    <HStack gap="space-16" align="center" className={`${globalStyles.container} ${styles.togglePanel}`} width="100%">
      <ToggleKnapp checked={venstreKolonne} onToggle={() => setVenstreKolonne(!venstreKolonne)}>
        Venstrekolonne
      </ToggleKnapp>
      <ToggleKnapp checked={midtreKolonne} onToggle={() => setMidtreKolonne(!midtreKolonne)}>
        Midtkolonne
      </ToggleKnapp>
      <ToggleKnapp checked={høyreKolonne} onToggle={() => setHøyreKolonne(!høyreKolonne)}>
        Høyrekolonne
      </ToggleKnapp>
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

import type { ReactNode } from 'react'

import classes from './SøknadslinjeContainer.module.css'

export function SøknadslinjeContainer({ children }: { children: ReactNode }) {
  return <nav className={classes.søknadslinjeContainer}>{children}</nav>
}

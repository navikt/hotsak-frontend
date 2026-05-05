import type { ReactNode } from 'react'

import classes from './HøyrekolonneInnslag.module.css'

export function HøyrekolonneInnslag({ children }: { children: ReactNode }) {
  return <li className={classes.høyrekolonneInnslag}>{children}</li>
}

import type { ReactNode } from 'react'

import classes from './Kolonner.module.css'

// TODO bytte ut disse med aksel HGrid
export function Kolonner({ children }: { children: ReactNode }) {
  return <div className={classes.kolonner}>{children}</div>
}

export function TreKolonner({ children }: { children: ReactNode }) {
  return <div className={classes.treKolonner}>{children}</div>
}

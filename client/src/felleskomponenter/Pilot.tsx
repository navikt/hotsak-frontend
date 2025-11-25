import { type ReactNode } from 'react'

import { type PilotName, useErPilot } from '../tilgang/useTilgang.ts'

export interface PilotProps {
  name: PilotName
  children: ReactNode
}

export function Pilot(props: PilotProps) {
  const { name, children } = props
  const erPilot = useErPilot(name)
  return erPilot ? <>{children}</> : null
}

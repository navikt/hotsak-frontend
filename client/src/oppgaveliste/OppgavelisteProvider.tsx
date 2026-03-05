import { type ReactNode } from 'react'

export interface OppgavelisteProviderProps {
  children: ReactNode
}

export function OppgavelisteProvider(props: OppgavelisteProviderProps) {
  const { children } = props
  return children
}

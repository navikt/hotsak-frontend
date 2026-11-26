import { lazy } from 'react'

const InnbyggersOppgaver = lazy(() => import('../oppgaveliste/InnbyggersOppgaver.tsx'))

export interface OppgaveoversiktPersonProps {
  fnr: string
}

export function OppgaveoversiktPerson(props: OppgaveoversiktPersonProps) {
  const { fnr } = props
  return <InnbyggersOppgaver fnr={fnr} />
}

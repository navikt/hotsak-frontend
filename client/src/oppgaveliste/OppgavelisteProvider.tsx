import { type ReactNode } from 'react'

import { OppgaveColumnsProvider } from './OppgaveColumnsProvider.tsx'
import { OppgavePaginationProvider } from './OppgavePaginationProvider.tsx'
import { DataGridFilterProvider } from '../felleskomponenter/data/DataGridFilterProvider.tsx'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'

export interface OppgavelisteProviderProps {
  suffix: 'Mine' | 'Enhetens' | 'Medarbeiders'
  defaultColumns: DefaultOppgaveColumns
  children: ReactNode
}

export function OppgavelisteProvider(props: OppgavelisteProviderProps) {
  const { suffix, defaultColumns, children } = props
  return (
    <OppgaveColumnsProvider suffix={suffix} defaultColumns={defaultColumns}>
      <OppgavePaginationProvider suffix={suffix}>
        <DataGridFilterProvider suffix={suffix}>{children}</DataGridFilterProvider>
      </OppgavePaginationProvider>
    </OppgaveColumnsProvider>
  )
}

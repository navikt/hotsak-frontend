import { useUmami } from '../sporing/useUmami.ts'
import { useCallback } from 'react'
import { DataGridFilterAction } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OppgaveColumnField } from './oppgaveColumns.tsx'

export function useOppgavelisteFiltrertHandler() {
  const { logOppgavelisteFiltrert } = useUmami()
  return useCallback(
    (action: DataGridFilterAction<OppgaveColumnField>) => {
      if (action.type !== 'addValue') return
      const verdi = redacted.has(action.field) ? '' : action.value
      logOppgavelisteFiltrert({ kolonne: action.field, verdi })
    },
    [logOppgavelisteFiltrert]
  )
}

const redacted: ReadonlySet<OppgaveColumnField> = new Set<OppgaveColumnField>([
  'beskrivelse',
  'brukerAlder',
  'brukerFnr',
  'brukerFødselsdato',
  'brukerNavn',
  'innsenderNavn',
  'saksbehandler',
])

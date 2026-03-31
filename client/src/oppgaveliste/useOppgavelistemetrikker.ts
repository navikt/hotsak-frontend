import { useCallback } from 'react'

import { useUmami } from '../sporing/useUmami.ts'
import { DataGridFilterAction } from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OppgaveColumnField } from './oppgaveColumns.tsx'

export function useOppgavelisteFiltrertHandler() {
  const { logOppgavelisteFiltrert } = useUmami()
  return useCallback(
    (action: DataGridFilterAction<OppgaveColumnField>) => {
      if (action.type !== 'addFieldValue') return
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

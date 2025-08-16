import { Button } from '@navikt/ds-react'
import { MouseEventHandler } from 'react'
import { useSWRConfig } from 'swr'

import { HttpError } from '../../io/HttpError.ts'
import { useOptionalOppgaveContext } from '../../oppgave/OppgaveContext.ts'
import { useOppgaveActions } from '../../oppgave/useOppgaveActions.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'

interface IkkeTildeltProps {
  onTildelingKonflikt?(): void
}

// fixme -> byttes med ny knapp
export function IkkeTildelt({ onTildelingKonflikt }: IkkeTildeltProps) {
  const saksbehandler = useInnloggetAnsatt()
  const { sakId } = useOptionalOppgaveContext()
  const { endreOppgavetildeling, state } = useOppgaveActions()
  const { mutate } = useSWRConfig()

  const oppdaterSakOgSakshistorikk = () => {
    return Promise.all([mutate(`api/sak/${sakId}`), mutate(`api/sak/${sakId}/historikk`)])
  }

  const tildel: MouseEventHandler = (event) => {
    event.stopPropagation()

    if (!saksbehandler || state.loading) return
    endreOppgavetildeling({ overtaHvisTildelt: false })
      .then(async () => {
        return oppdaterSakOgSakshistorikk()
      })
      .catch((err: HttpError) => {
        if (err.isConflict() && onTildelingKonflikt) {
          onTildelingKonflikt()
        } else {
          return oppdaterSakOgSakshistorikk()
        }
      })
  }

  return (
    <Button
      type="button"
      size="small"
      variant="secondary"
      name="Ta saken"
      onClick={tildel}
      disabled={state.loading}
      loading={state.loading}
    >
      Ta saken
    </Button>
  )
}

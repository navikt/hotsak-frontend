import { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'
import { Button } from '@navikt/ds-react'

import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { useOppgaveService } from '../../oppgave/OppgaveService.ts'
import { GjeldendeOppgave } from '../../oppgave/OppgaveContext.ts'
import { HttpError } from '../../io/HttpError.ts'

interface IkkeTildeltProps {
  sakId: number | string
  gjeldendeOppgave?: GjeldendeOppgave
  gåTilSak: boolean
  onTildelingKonflikt?(): void
}

export function IkkeTildelt({ sakId, gjeldendeOppgave, gåTilSak = false, onTildelingKonflikt }: IkkeTildeltProps) {
  const saksbehandler = useInnloggetSaksbehandler()
  const { endreOppgavetildeling, state } = useOppgaveService(gjeldendeOppgave)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const oppdaterSakOgSakshistorikk = () => {
    mutate(`api/sak/${sakId}`)
    mutate(`api/sak/${sakId}/historikk`)
  }
  const tildel = (event: MouseEvent) => {
    event.stopPropagation()

    if (gåTilSak) {
      logAmplitudeEvent(amplitude_taxonomy.SAK_STARTET_FRA_OPPGAVELISTE)
    } else {
      logAmplitudeEvent(amplitude_taxonomy.SAK_STARTET_FRA_SAK)
    }

    if (!saksbehandler || state.loading) return
    endreOppgavetildeling({ overtaHvisTildelt: false })
      .then(() => {
        if (gåTilSak) {
          const destinationUrl = `/sak/${sakId}/hjelpemidler`
          return navigate(destinationUrl)
        } else {
          return oppdaterSakOgSakshistorikk()
        }
      })
      .catch((e: HttpError) => {
        if (e.isConflict() && onTildelingKonflikt) {
          onTildelingKonflikt()
        } else {
          oppdaterSakOgSakshistorikk()
        }
      })
  }

  return (
    <Button
      type="button"
      size={gåTilSak ? 'xsmall' : 'small'}
      variant={gåTilSak ? 'tertiary' : 'secondary'}
      onClick={tildel}
      name="Ta saken"
      disabled={state.loading}
      loading={state.loading}
    >
      Ta saken
    </Button>
  )
}

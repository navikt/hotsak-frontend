import { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'
import { Button } from '@navikt/ds-react'

import { ResponseError } from '../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { useOppgaveService } from '../../oppgave/OppgaveService.ts'
import { GjeldendeOppgave } from '../../oppgave/OppgaveContext.ts'

interface IkkeTildeltProps {
  sakId: number | string
  gjeldendeOppgave?: GjeldendeOppgave
  gåTilSak: boolean
  onTildelingKonflikt?(): void
}

export function IkkeTildelt({ sakId, gjeldendeOppgave, gåTilSak = false, onTildelingKonflikt }: IkkeTildeltProps) {
  const saksbehandler = useInnloggetSaksbehandler()
  const { endreOppgavetildeling } = useOppgaveService(gjeldendeOppgave)
  const [isFetching, setIsFetching] = useState(false)
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

    if (!saksbehandler || isFetching) return
    setIsFetching(true)
    endreOppgavetildeling({ overtaHvisTildelt: false })
      .then(() => {
        if (gåTilSak) {
          const destinationUrl = `/sak/${sakId}/hjelpemidler`
          navigate(destinationUrl)
        } else {
          oppdaterSakOgSakshistorikk()
        }
      })
      .catch((e: ResponseError) => {
        if (e.statusCode == 409 && onTildelingKonflikt) {
          onTildelingKonflikt()
        } else {
          setIsFetching(false)
          oppdaterSakOgSakshistorikk()
        }
      })
  }

  return (
    <>
      {
        <Button
          size={gåTilSak ? 'xsmall' : 'small'}
          variant={gåTilSak ? 'tertiary' : 'secondary'}
          onClick={tildel}
          name="Ta saken"
          disabled={isFetching}
          loading={isFetching}
        >
          Ta saken
        </Button>
      }
    </>
  )
}

import { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSWRConfig } from 'swr'
import { Button } from '@navikt/ds-react'
import { postTildeling, ResponseError } from '../../io/http'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { useInnloggetSaksbehandler } from '../../state/authentication'

interface IkkeTildeltProps {
  oppgavereferanse: number | string
  gåTilSak: boolean
  onTildelingKonflikt?: () => void
}

export const IkkeTildelt = ({ oppgavereferanse, gåTilSak = false, onTildelingKonflikt }: IkkeTildeltProps) => {
  const saksbehandler = useInnloggetSaksbehandler()
  const [isFetching, setIsFetching] = useState(false)
  const navigate = useNavigate()
  const { mutate } = useSWRConfig()
  const oppdaterSakOgHistorie = () => {
    mutate(`api/sak/${oppgavereferanse}`)
    mutate(`api/sak/${oppgavereferanse}/historikk`)
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
    postTildeling(oppgavereferanse, false)
      .then(() => {
        if (gåTilSak) {
          const destinationUrl = `/sak/${oppgavereferanse}/hjelpemidler`
          navigate(destinationUrl)
        } else {
          oppdaterSakOgHistorie()
        }
      })
      .catch((e: ResponseError) => {
        if (e.statusCode == 409 && onTildelingKonflikt) {
          onTildelingKonflikt()
        } else {
          setIsFetching(false)
          oppdaterSakOgHistorie()
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

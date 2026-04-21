import { InfoCard, Textarea } from '@navikt/ds-react'
import { BekreftelseModal } from '../../../saksbilde/komponenter/BekreftelseModal'
import { TextContainer } from '../../../felleskomponenter/typografi'
import { useBehandling } from '../behandling/useBehandling'
import { VedtaksResultat } from '../behandling/behandlingTyper'
import { useAngreVedtak } from './useAngreVedtak'
import { useState } from 'react'

export function AngreVedtakModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { gjeldendeBehandling } = useBehandling()
  const vedtaksResultat = (gjeldendeBehandling?.utfall?.utfall as VedtaksResultat) || null
  const { angreVedtak } = useAngreVedtak()
  const [årsak, setÅrsak] = useState('')
  const [årsakError, setÅrsakError] = useState<string | undefined>(undefined)

  const onBekreft = async () => {
    if (!årsak.trim()) {
      setÅrsakError('Du må oppgi en årsak for å angre vedtaket')
      return
    }
    await angreVedtak({ årsak: årsak.trim() })
    onClose()
  }

  const handleClose = () => {
    setÅrsak('')
    setÅrsakError(undefined)
    onClose()
  }

  return (
    <BekreftelseModal
      heading={`Er du sikker på at du vil angre på vedtaket?`}
      open={open}
      width="700px"
      buttonSize="medium"
      bekreftButtonLabel={`Angre vedtak`}
      onBekreft={onBekreft}
      onClose={handleClose}
    >
      <p>Det er mulig å angre på vedtaket samme virkedag som det ble fattet.</p>
      <p>
        Ved angring av vedtaket vil vi stoppe videre distribusjon av vedtaket og det eventuelle brevet til andre
        fagsystemer, og gjøre behandlingen aktiv igjen.
      </p>
      <p>
        Vi oppretter også en ny aktiv oppgave knyttet til saken, og resultatet du valgte samt det eventuelle brevet du
        skrev på den opprinnelige oppgaven vil følge med over til den nye oppgaven.
      </p>
      <p>
        Etter angring vil den nye oppgaven knyttet til saken være på listen over dine oppgaver. Vi navigerer deg
        automatisk til den.
      </p>
      {(vedtaksResultat === VedtaksResultat.INNVILGET || vedtaksResultat === VedtaksResultat.DELVIS_INNVILGET) && (
        <InfoCard data-color="warning" size="small" style={{ marginBottom: '1rem' }}>
          <InfoCard.Header>
            <InfoCard.Title>Du må lukke SF i OeBS.</InfoCard.Title>
          </InfoCard.Header>
          <TextContainer>
            <InfoCard.Content>
              <p>
                Ved innvilgelse eller delvis innvilgelse oppretter vi automatisk SF i OeBS ved fatting av vedtaket. Hvis
                du angrer vedtaket må du derfor manuelt lukke SF'en i OeBS. Eventuelle åpne ordre må annulleres og
                anmodninger/bestillinger må slettes om mulig i dialog med leverandør og Sentral forsyningsenhet (SFE).
              </p>
            </InfoCard.Content>
          </TextContainer>
        </InfoCard>
      )}
      <Textarea
        label="Årsak for angring"
        description="Beskriv hvorfor du ønsker å angre vedtaket. Beskrivelsen vil havne i sakshistorikken. "
        value={årsak}
        onChange={(e) => {
          setÅrsak(e.target.value)
          if (årsakError && e.target.value.trim()) {
            setÅrsakError(undefined)
          }
        }}
        error={årsakError}
      />
    </BekreftelseModal>
  )
}

import { BodyShort, Button, Dialog, HStack } from '@navikt/ds-react'
import { useNavigate } from 'react-router'

import { useEffect } from 'react'
import { useEventSource } from '../event/useEventSource.ts'
import { Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { SakEventType } from '../sak/sakTypes.ts'
import { type JournalføringV2Response } from './journalføringTypes.ts'

interface JournalføringFerdigModalProps {
  open: boolean
  resultat: JournalføringV2Response | null
  sakType: 'ny' | 'eksisterende'
  onClose(): void
}

export function finnOppgaveIdForSak(resultat: JournalføringV2Response | null) {
  return resultat?.oppgaver.find(
    ({ oppgavetype, statuskategori }) =>
      oppgavetype === Oppgavetype.BEHANDLE_SAK && statuskategori === Statuskategori.ÅPEN
  )?.oppgaveId
}

export function finnStiTilSak(resultat: JournalføringV2Response) {
  const oppgaveIdForSak = finnOppgaveIdForSak(resultat)
  return oppgaveIdForSak ? `/oppgave/${oppgaveIdForSak}` : `/sak/${resultat.sakId}`
}

export function JournalføringFerdigModal({ open, resultat, sakType, onClose }: JournalføringFerdigModalProps) {
  const navigate = useNavigate()

  const sakshendelserUrl = resultat ? `/api/sak/${resultat.sakId}/hendelser` : null
  const { data, error } = useEventSource(sakshendelserUrl, SakEventType.journalpostSakFerdigstilt)
  useEffect(() => {
    if (data) console.log(data)
    if (error) console.error(error)
  }, [data, error])

  function navigerOgLukkModal(sti: string) {
    onClose()
    navigate(sti)
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()} size="medium">
      <Dialog.Popup>
        <Dialog.Header>
          <Dialog.Title>Journalpost ferdig journalført</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          {sakType === 'eksisterende' ? (
            <BodyShort>Journalposten ble koblet til sak {resultat?.sakId ?? '–'}.</BodyShort>
          ) : (
            <BodyShort>Sak med sakId {resultat?.sakId ?? '–'} ble opprettet.</BodyShort>
          )}
        </Dialog.Body>
        <Dialog.Footer>
          <HStack gap="space-16" align="center" justify="center">
            <Button variant="primary" size="small" onClick={() => resultat && onClose()}>
              Lukk
            </Button>
            {sakType === 'eksisterende' && (
              <Button
                variant="secondary"
                size="small"
                onClick={() => resultat && navigerOgLukkModal(finnStiTilSak(resultat))}
              >
                Til saken
              </Button>
            )}
            <Button variant="secondary" size="small" onClick={() => navigerOgLukkModal('/oppgaver/mine')}>
              Til mine oppgaver
            </Button>
            <Button variant="secondary" size="small" onClick={() => navigerOgLukkModal('/oppgaver/enhetens')}>
              Til enhetens oppgaver
            </Button>
          </HStack>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}

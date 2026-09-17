import { BodyShort, Button, Dialog, HStack } from '@navikt/ds-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { type JournalføringV2Response } from './journalføringTypes.ts'
import { finnModalvariant, finnStiTilSak, lagJournalføringFerdigModalmodell } from './journalføringFerdigModalUtils.ts'
import { useJournalpostSakFerdigstiltHendelse } from './useJournalpostSakFerdigstiltHendelse.ts'

interface JournalføringFerdigModalProps {
  open: boolean
  resultat: JournalføringV2Response | null
  sakType: 'ny' | 'eksisterende'
  skjulTilSaken?: boolean
  onJournalpostSakFerdigstilt(): void
  onClose(): void
}

export function JournalføringFerdigModal({
  open,
  resultat,
  sakType,
  skjulTilSaken = false,
  onJournalpostSakFerdigstilt,
  onClose,
}: JournalføringFerdigModalProps) {
  const navigate = useNavigate()

  const { journalpostSakFerdigstilt } = useJournalpostSakFerdigstiltHendelse(resultat?.sakId)

  useEffect(() => {
    if (journalpostSakFerdigstilt) {
      onJournalpostSakFerdigstilt()
    }
  }, [journalpostSakFerdigstilt, onJournalpostSakFerdigstilt])

  const variant = finnModalvariant(sakType, skjulTilSaken)
  const modalmodell = lagJournalføringFerdigModalmodell(variant, resultat?.sakId)

  function navigerOgLukkModal(sti: string) {
    onClose()
    navigate(sti)
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()} size="medium">
      <Dialog.Popup position="center">
        <Dialog.Header>
          <Dialog.Title>Journalføringen er fullført og ny sak opprettet</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <BodyShort>{modalmodell.melding}</BodyShort>
        </Dialog.Body>
        <Dialog.Footer>
          <HStack gap="space-16" align="center" justify="center">
            <Button variant="secondary" size="small" onClick={() => navigerOgLukkModal('/oppgaver/mine')}>
              Til mine oppgaver
            </Button>
            <Button variant="secondary" size="small" onClick={() => navigerOgLukkModal('/oppgaver/enhetens')}>
              Til enhetens oppgaver
            </Button>
            {modalmodell.visTilSaken && variant === 'ny-sak' && (
              <Button
                variant="primary"
                size="small"
                loading={!journalpostSakFerdigstilt}
                onClick={() => {
                  const oppgaveId = journalpostSakFerdigstilt?.oppgaveId
                  if (oppgaveId) {
                    navigerOgLukkModal(`/oppgave/${oppgaveId}`)
                  }
                }}
              >
                Behandle saken
              </Button>
            )}
            {modalmodell.visTilSaken && variant === 'eksisterende-hotsak' && (
              <Button
                variant="primary"
                size="small"
                onClick={() => resultat && navigerOgLukkModal(finnStiTilSak(resultat))}
              >
                Behandle saken
              </Button>
            )}
          </HStack>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}

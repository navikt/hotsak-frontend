import {
  Box,
  Button,
  DatePicker,
  type DateValidationT,
  Dialog,
  Radio,
  RadioGroup,
  Textarea,
  useDatepicker,
  VStack,
} from '@navikt/ds-react'

import { addDays, addWeeks } from 'date-fns'
import { useMemo, useState } from 'react'
import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { Tekst } from '../felleskomponenter/typografi.tsx'
import { Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { formaterDato, tilLocalDateString } from '../utils/dato.ts'
import { isNotBlank } from '../utils/type.ts'
import { useBrevActions } from './useBrevActions.ts'

const antallUkerPåVent: Record<string, number> = {
  '4-uker': 4,
  '3-uker': 3,
  '2-uker': 2,
}

export function SendBrevDialog({
  oppgave,
  brevId,
  open,
  onClose,
}: {
  oppgave: Saksbehandlingsoppgave
  brevId: string
  open: boolean
  onClose: () => void
}) {
  const { sendUnderveisBrev } = useBrevActions(oppgave, brevId)
  const { trigger, isMutating, reset } = sendUnderveisBrev
  const { showErrorToast } = useToast()
  const [valg, setValg] = useState('fortsett')
  const [ventePeriode, setVentePeriode] = useState('4-uker')
  const [kommentar, setKommentar] = useState('')
  const [validation, setValidation] = useState<DateValidationT | null>(null)
  const [visDatovalidering, setVisDatovalidering] = useState(false)
  const idag = useMemo(() => new Date(), [])
  const imorgen = addDays(idag, 1)
  const ventedato = (periode: string) => addWeeks(idag, antallUkerPåVent[periode])

  const { datepickerProps, inputProps, selectedDay } = useDatepicker({
    required: true,
    fromDate: imorgen,
    onValidate: (newValidation) => {
      setValidation(newValidation)
    },
  })

  const handleClose = () => {
    if (isMutating) {
      return
    }
    reset()
    onClose()
  }

  const handleSendBrev = async () => {
    let settPåVentTil: Date | undefined
    if (valg === 'sett-på-vent') {
      if (ventePeriode === 'velg-dato') {
        setVisDatovalidering(true)
        if (!selectedDay || !validation?.isValidDate) return
        settPåVentTil = selectedDay
      } else {
        settPåVentTil = ventedato(ventePeriode)
      }
    }

    reset()

    try {
      await trigger({
        settPåVentTil: settPåVentTil && tilLocalDateString(settPåVentTil),
        kommentar: isNotBlank(kommentar) ? kommentar : undefined,
      })
      onClose()
    } catch {
      showErrorToast('En feil oppstod ved sending av brevet.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && handleClose()} size="small">
      <Dialog.Popup closeOnOutsideClick={false} width="600px" aria-label="Send brev">
        <Dialog.Header>
          <Dialog.Title>Send brev</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap="space-8">
            <Tekst>
              Når brevet sendes kan du velge å fortsette behandling av saken, eller å sette den på vent. Distribusjon av
              brevet vil starte 08:00 påfølgende virkedag.
            </Tekst>
            <RadioGroup
              legend="Hva vil du gjøre med saken når brevet er sendt?"
              onChange={(value) => setValg(value)}
              value={valg}
              size="small"
            >
              <Radio value="fortsett">Fortsett behandling</Radio>
              <Radio value="sett-på-vent">Sett på vent</Radio>
            </RadioGroup>
            {valg === 'sett-på-vent' && (
              <Box padding="space-12" borderRadius="8" background="brand-blue-moderate">
                <RadioGroup
                  legend="Hvor lenge skal saken settes på vent?"
                  onChange={(value) => setVentePeriode(value)}
                  value={ventePeriode}
                  size="small"
                >
                  <Radio value="4-uker">4 uker ({formaterDato(ventedato('4-uker'))})</Radio>
                  <Radio value="3-uker">3 uker ({formaterDato(ventedato('3-uker'))})</Radio>
                  <Radio value="2-uker">2 uker ({formaterDato(ventedato('2-uker'))})</Radio>
                  <Radio value="velg-dato">Velg dato</Radio>
                </RadioGroup>
                {ventePeriode === 'velg-dato' && (
                  <DatePicker {...datepickerProps}>
                    <DatePicker.Input
                      {...inputProps}
                      size="small"
                      label="Velg dato"
                      hideLabel
                      onBlur={() => setVisDatovalidering(true)}
                      error={
                        visDatovalidering &&
                        (!selectedDay || !validation?.isValidDate) &&
                        'Du må velge eller skrive inn en sett-på-vent dato. Format: dd.mm.åååå'
                      }
                    />
                  </DatePicker>
                )}
              </Box>
            )}
            <Textarea
              label="Kommentar (valgfri)"
              description="Her kan du informere om eventuelle mangler eller annet som bør sjekkes opp i saken"
              size="small"
              maxLength={2000}
              value={kommentar}
              onChange={(event) => setKommentar(event.target.value)}
            />
          </VStack>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="button" size="small" variant="secondary" onClick={handleClose} disabled={isMutating}>
            Avbryt
          </Button>
          <Button type="button" size="small" loading={isMutating} onClick={handleSendBrev}>
            Send brev
          </Button>
        </Dialog.Footer>
      </Dialog.Popup>
    </Dialog>
  )
}

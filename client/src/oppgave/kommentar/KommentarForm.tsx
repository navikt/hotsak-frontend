import { Alert, Button, Textarea, VStack } from '@navikt/ds-react'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useToast } from '../../felleskomponenter/toast/useToast'
import { useOppgaveContext, useOppgaveDispatch } from '../OppgaveContext'
import { type Oppgave } from '../oppgaveTypes'
import { useOppgaveActions } from '../useOppgaveActions'

export interface KommentarFormProps {
  oppgave: Oppgave
}

export function KommentarForm(props: KommentarFormProps) {
  const { oppgave } = props
  const { kommentar } = useOppgaveContext()
  const form = useForm({
    defaultValues: kommentar,
  })

  const {
    formState: { isSubmitting, errors },
  } = form

  const { lagreKommentar } = useOppgaveActions(oppgave)
  const { showSuccessToast } = useToast()
  const handleSubmit = form.handleSubmit(async ({ tekst }) => {
    await lagreKommentar(tekst)
    showSuccessToast('Kommentaren ble lagret')
    form.reset({ tekst: '' })
  })

  const dispatch = useOppgaveDispatch()
  useEffect(() => {
    return () => {
      dispatch({
        type: 'kommentar',
        tekst: form.getValues('tekst'),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <VStack as="form" gap="space-16" onSubmit={handleSubmit}>
        <Alert variant="info" size="small" inline>
          Kommentarene kan bli utlevert til innbygger ved forespørsel om innsyn
        </Alert>
        <Textarea
          label="Kommentar"
          size="small"
          minLength={3}
          maxLength={2000}
          error={errors.tekst?.message}
          {...form.register('tekst', {
            required: 'Du må skrive en kommentar',
            minLength: {
              value: 3,
              message: 'Kommentaren må være minst 3 tegn',
            },
            maxLength: {
              value: 2000,
              message: 'Kommentaren kan ikke være mer enn 2000 tegn',
            },
          })}
        />
        <div>
          <Button type="submit" size="small" variant="primary" loading={isSubmitting}>
            Lagre kommentar
          </Button>
        </div>
      </VStack>
    </div>
  )
}

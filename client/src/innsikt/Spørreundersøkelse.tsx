import { useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Alert, Button, Modal, ModalProps, ReadMore, VStack } from '@navikt/ds-react'

import type { ISpørreundersøkelse, SpørreundersøkelseId } from './spørreundersøkelser'
import { useSpørreundersøkelse } from './useSpørreundersøkelse'
import { Spørsmål } from './Spørsmål'
import { besvarelseToSvar, IBesvarelse, ISvar } from './Besvarelse'
import { logDebug } from '../utvikling/logDebug'

export interface SpørreundersøkelseProps extends Pick<ModalProps, 'open'> {
  loading?: boolean
  spørreundersøkelseId: SpørreundersøkelseId
  size?: 'medium' | 'small'
  knappetekst?: string

  onBesvar(spørreundersøkelse: ISpørreundersøkelse, besvarelse: IBesvarelse, svar: ISvar[]): void | Promise<void>
  error?: string | undefined
  onClose?(): void
}

export function Spørreundersøkelse(props: SpørreundersøkelseProps) {
  const { open, loading, spørreundersøkelseId, size, knappetekst = 'Besvar', onBesvar, onClose, error } = props
  const { spørreundersøkelse, defaultValues } = useSpørreundersøkelse(spørreundersøkelseId)
  const { spørsmål } = spørreundersøkelse
  const form = useForm<IBesvarelse>({ defaultValues })
  const { formState, reset, handleSubmit } = form
  const ref = useRef<HTMLDialogElement>(null)
  const loadingOrSubmitting = loading || formState.isSubmitting

  const resetForm = () => {
    reset(defaultValues)
    return true
  }

  return (
    <Modal
      ref={ref}
      header={{ heading: spørreundersøkelse.tittel, size }}
      open={open}
      onCancel={resetForm}
      onBeforeClose={resetForm}
      onClose={onClose}
      width={800}
    >
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(async (besvarelse) => {
            const svar = besvarelseToSvar(spørreundersøkelse, besvarelse)
            logDebug(svar)
            return onBesvar(spørreundersøkelse, besvarelse, svar)
          })}
        >
          <Modal.Body style={{ paddingTop: 0 }}>
            <VStack gap="5">
              {spørreundersøkelse.beskrivelse && (
                <ReadMore header={spørreundersøkelse.beskrivelse.header} size={size}>
                  {spørreundersøkelse.beskrivelse.body}
                </ReadMore>
              )}
              {spørsmål.map((spørsmål) => (
                <Spørsmål key={spørsmål.tekst} spørsmål={spørsmål} nivå={0} size={size} />
              ))}
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              size="small"
              variant="primary"
              disabled={loadingOrSubmitting}
              loading={loadingOrSubmitting}
            >
              {knappetekst}
            </Button>
            <Button
              type="button"
              size="small"
              variant="secondary"
              onClick={() => {
                resetForm()
                if (onClose) onClose()
              }}
              disabled={loadingOrSubmitting}
            >
              Avbryt
            </Button>
            {error && (
              <Alert variant="error" inline>
                Klarte ikke å sende inn svaret ditt. Prøv igjen senere.
              </Alert>
            )}
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  )
}

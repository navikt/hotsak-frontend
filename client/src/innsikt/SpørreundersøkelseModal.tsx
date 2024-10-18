import { Alert, Button, Modal, ModalProps } from '@navikt/ds-react'
import { useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { logDebug } from '../utvikling/logDebug'
import { besvarelseToSvar, IBesvarelse, Tilbakemelding } from './Besvarelse'
import type { ISpørreundersøkelse, SpørreundersøkelseId } from './spørreundersøkelser'
import { SpørreundersøkelseStack } from './SpørreundersøkelseStack.tsx'
import { useSpørreundersøkelse } from './useSpørreundersøkelse'

export interface SpørreundersøkelseModalProps extends Pick<ModalProps, 'open'> {
  loading?: boolean
  spørreundersøkelseId: SpørreundersøkelseId
  size?: 'medium' | 'small'
  knappetekst?: string

  onBesvar(
    tilbakemelding: Tilbakemelding,
    besvarelse: IBesvarelse,
    spørreundersøkelse: ISpørreundersøkelse
  ): void | Promise<void>
  error?: string | undefined
  onClose?(): void
}

export function SpørreundersøkelseModal(props: SpørreundersøkelseModalProps) {
  const { open, loading, spørreundersøkelseId, size, knappetekst = 'Besvar', onBesvar, onClose, error } = props
  const { spørreundersøkelse, defaultValues } = useSpørreundersøkelse(spørreundersøkelseId)
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
            return onBesvar(
              {
                skjema: spørreundersøkelse.skjema,
                svar,
              },
              besvarelse,
              spørreundersøkelse
            )
          })}
        >
          <Modal.Body style={{ paddingTop: 0 }}>
            <SpørreundersøkelseStack spørreundersøkelse={spørreundersøkelse} size={size} />
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

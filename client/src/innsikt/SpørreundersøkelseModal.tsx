import { Alert, Button, ButtonProps, Modal, ModalProps, Stack, VStack } from '@navikt/ds-react'
import { useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { besvarelseToSvar, IBesvarelse, Tilbakemelding } from './Besvarelse'
import type { ISpørreundersøkelse, SpørreundersøkelseId } from './spørreundersøkelser'
import { SpørreundersøkelseStack } from './SpørreundersøkelseStack'
import { useSpørreundersøkelse } from './useSpørreundersøkelse'
import { textcontainerBredde } from '../GlobalStyles'

export interface SpørreundersøkelseModalProps extends Pick<ModalProps, 'open'> {
  loading?: boolean
  spørreundersøkelseId: SpørreundersøkelseId
  size?: 'medium' | 'small'
  knappetekst?: string
  avbrytKnappetekst?: string
  bekreftKnappVariant?: ButtonProps['variant']
  avbrytKnappVariant?: ButtonProps['variant']
  reverserKnapperekkefølge?: boolean
  children?: React.ReactNode

  onBesvar(
    tilbakemelding: Tilbakemelding,
    besvarelse: IBesvarelse,
    spørreundersøkelse: ISpørreundersøkelse
  ): void | Promise<void>
  error?: string | undefined
  onClose?(): void
}

export function SpørreundersøkelseModal(props: SpørreundersøkelseModalProps) {
  const {
    open,
    loading,
    spørreundersøkelseId,
    size,
    knappetekst = 'Besvar',
    avbrytKnappetekst = 'Avbryt',
    bekreftKnappVariant = 'primary',
    avbrytKnappVariant = 'secondary',
    reverserKnapperekkefølge = false,
    onBesvar,
    onClose,
    error,
    children,
  } = props
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
      width={700}
    >
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(async (besvarelse) => {
            const svar = besvarelseToSvar(spørreundersøkelse, besvarelse)
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
            <VStack gap="space-16" style={{ maxWidth: `${textcontainerBredde}` }} marginInline={'space-0 space-24'}>
              {children}
              <SpørreundersøkelseStack spørreundersøkelse={spørreundersøkelse} size={size} />
            </VStack>
          </Modal.Body>
          <Modal.Footer>
            <Stack gap="space-16" justify="end" direction={reverserKnapperekkefølge ? 'row' : 'row-reverse'}>
              <Button
                type="submit"
                size="small"
                variant={bekreftKnappVariant}
                disabled={loadingOrSubmitting}
                loading={loadingOrSubmitting}
              >
                {knappetekst}
              </Button>
              <Button
                type="button"
                size="small"
                variant={avbrytKnappVariant}
                onClick={() => {
                  resetForm()
                  if (onClose) onClose()
                }}
                disabled={loadingOrSubmitting}
              >
                {avbrytKnappetekst}
              </Button>
            </Stack>
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

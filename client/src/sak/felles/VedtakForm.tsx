import { Button, HelpText, HStack, InlineMessage, Textarea, TextField, VStack } from '@navikt/ds-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { Sak } from '../../types/types.internal'
import { useVedtak, VedtakFormValues } from './useVedtak'

interface VedtakFormProps {
  sak: Sak
  onVedtak: (data: VedtakFormValues) => void
  postbegrunnelsePåkrevd?: boolean
}

export interface VedtakFormHandle {
  submit: () => Promise<void>
}

export const VedtakForm = forwardRef<VedtakFormHandle, VedtakFormProps>(
  ({ sak, onVedtak, postbegrunnelsePåkrevd = true }: VedtakFormProps, ref) => {
    const [harLagretPostbegrunnelse, setHarLagretPostbegrunnelse] = useState(false)

    const { form, sammendragMedLavere, logTilUmami } = useVedtak(sak)

    const validerProblemsammendrag = (value: string | undefined) => {
      if (!sammendragMedLavere) {
        return true
      }
      if (!value || value.trim() === '') {
        return 'Problemsammendrag er påkrevd når det er søkt om lavere rangerte hjelpemidler'
      }
      if (!value.trim().startsWith('POST ')) {
        return 'Problemsammendraget må starte med "POST"'
      }
      const brackets = [...value.matchAll(/\[([^\]]+)\]/g)]
      if (brackets.length > 0) {
        const placeholders = brackets.map((match) => `"${match[1]}"`).join(', ')
        return `Du må fylle ut følgende i problemsammendraget: ${placeholders}`
      }
      return true
    }

    const validerPostbegrunnelse = (value: string | undefined) => {
      if (!value || value.trim() === '' || value.trim() === 'POST') {
        console.log('Mangler begrunnelse')

        return 'Begrunnelse er påkrevd når det er søkt om lavere rangerte hjelpemidler'
      }
      if (!value.trim().startsWith('POST ')) {
        console.log('Må starte med POST')
        return 'Begrunnelsen må starte med "POST"'
      }
      return true
    }

    const handleSubmit = async (data: VedtakFormValues) => {
      await onVedtak(data)
      logTilUmami()
    }

    useImperativeHandle(ref, () => ({
      submit: () => form.handleSubmit(handleSubmit)(),
    }))

    return (
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <VStack gap="space-16">
            <Controller
              name="problemsammendrag"
              control={form.control}
              rules={{
                validate: validerProblemsammendrag,
              }}
              render={({ field, fieldState }) => (
                <TextField
                  label={
                    <HStack wrap={false} gap="2" align="center">
                      <Etikett>Problemsammendrag til OeBS </Etikett>
                      <HelpText strategy="fixed">
                        <Tekst>
                          Foreslått tekst oppfyller registreringsinstruksen. Du kan redigere teksten i
                          problemsammendraget dersom det er nødvendig. Det kan du gjøre i feltet nedenfor før saken
                          innvilges eller inne på SF i OeBS som tidligere.
                        </Tekst>
                      </HelpText>
                    </HStack>
                  }
                  size="small"
                  {...field}
                  value={field.value ?? ''}
                  error={fieldState.error?.message}
                />
              )}
            />
            {postbegrunnelsePåkrevd && sammendragMedLavere && (
              <VStack gap="space-8">
                <Textarea
                  readOnly={harLagretPostbegrunnelse}
                  label={
                    <HStack wrap={false} gap="2" align="center">
                      <Etikett>Begrunnelse for lavere rangering</Etikett>
                      <HelpText strategy="fixed">
                        <Tekst>
                          Faglig begrunnelse for hvorfor det velges et hjelpemiddel med lavere rangering
                          ("postbegrunnelse"). En faglig begrunnelse skal skrives slik at utenforstående forstår hvorfor
                          produktet er valgt. Det er ikke nødvendig å begrunne hvorfor produktet som er rangert som nr.
                          1 ikke velges. Teksten overføres til OeBS.
                        </Tekst>
                      </HelpText>
                    </HStack>
                  }
                  description="Se over begrunnelsen og fjern sensitive opplysninger"
                  size="small"
                  error={form.formState.errors.postbegrunnelse?.message}
                  {...form.register('postbegrunnelse', {
                    validate: (value) => {
                      if (!harLagretPostbegrunnelse) {
                        return 'Du må godkjenne begrunnelsen før søknaden kan innvilges'
                      }
                      return validerPostbegrunnelse(value)
                    },
                  })}
                />
                <HStack align="center" gap="space-8">
                  {harLagretPostbegrunnelse ? (
                    <>
                      <InlineMessage status="success" size="small">
                        Du har godkjent begrunnelsen
                      </InlineMessage>
                      <Button
                        type="button"
                        variant="tertiary"
                        size="small"
                        onClick={() => {
                          form.clearErrors('postbegrunnelse')
                          setHarLagretPostbegrunnelse(false)
                        }}
                      >
                        Angre
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      onClick={() => {
                        const value = form.getValues('postbegrunnelse')
                        const valideringResultat = validerPostbegrunnelse(value)
                        if (valideringResultat !== true) {
                          console.log(valideringResultat + ' - kan ikke godkjenne', valideringResultat)
                          form.setError('postbegrunnelse', { message: valideringResultat })
                        } else {
                          form.clearErrors('postbegrunnelse')
                          setHarLagretPostbegrunnelse(true)
                        }
                      }}
                    >
                      Godkjenn begrunnelse
                    </Button>
                  )}
                </HStack>
              </VStack>
            )}
          </VStack>
          <button type="submit" style={{ display: 'none' }} />
        </form>
      </FormProvider>
    )
  }
)

export function useVedtakFormSubmit() {
  const form = useForm<VedtakFormValues>()
  return () => form.handleSubmit((data) => data)()
}

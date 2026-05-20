import { Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react'
import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Henleggelsesårsak } from './behandlingTyper'

interface HenleggFormProps {
  onHenleggelse: () => void
  onSave: (årsak: Henleggelsesårsak | null, begrunnelse: string | null) => void
  defaultÅrsak: Henleggelsesårsak | null
  defaultBegrunnelse: string | null
}

export interface HenleggFormValues {
  årsak: Henleggelsesårsak
  begrunnelse: string
}

export interface HenleggFormHandle {
  validate: () => Promise<boolean>
  submit: () => Promise<boolean>
}

export const HenleggForm = forwardRef<HenleggFormHandle, HenleggFormProps>(
  ({ onHenleggelse, onSave, defaultÅrsak, defaultBegrunnelse }, ref) => {
    const { control, handleSubmit, getValues } = useForm<HenleggFormValues>({
      defaultValues: {
        årsak: defaultÅrsak ?? undefined,
        begrunnelse: defaultBegrunnelse ?? '',
      },
    })

    useImperativeHandle(ref, () => ({
      validate: () =>
        new Promise<boolean>((resolve) => {
          handleSubmit(
            () => resolve(true),
            () => resolve(false)
          )()
        }),
      submit: () =>
        new Promise<boolean>((resolve) => {
          handleSubmit(
            async () => {
              await onHenleggelse()
              resolve(true)
            },
            () => resolve(false)
          )()
        }),
    }))

    return (
      <VStack gap="space-16" marginBlock="space-16 space-0">
        <Controller
          name="årsak"
          control={control}
          rules={{ required: 'Du må velge en årsak' }}
          render={({ field, fieldState }) => (
            <RadioGroup
              legend="Hva er grunnen til at du henlegger saken?"
              size="small"
              value={field.value ?? ''}
              onChange={(value) => {
                field.onChange(value)
                onSave(value, getValues('begrunnelse') || null)
              }}
              error={fieldState.error?.message}
            >
              <Radio value={Henleggelsesårsak.SØKNAD_TRUKKET}>Søknaden er trukket av bruker</Radio>
              <Radio value={Henleggelsesårsak.FEILAKTIG_OPPRETTET}>Søknaden er feilaktig opprettet</Radio>
              <Radio value={Henleggelsesårsak.ANNET}>Annet</Radio>
            </RadioGroup>
          )}
        />
        <Controller
          name="begrunnelse"
          control={control}
          rules={{ required: 'Du må fylle ut en begrunnelse' }}
          render={({ field, fieldState }) => (
            <Textarea
              label="Begrunnelse"
              size="small"
              {...field}
              onBlur={(e) => {
                field.onBlur()
                onSave(getValues('årsak') || null, e.target.value)
              }}
              error={fieldState.error?.message}
            />
          )}
        />
      </VStack>
    )
  }
)

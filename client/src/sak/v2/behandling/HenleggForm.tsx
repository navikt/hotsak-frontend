import { Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react'
import { forwardRef, useImperativeHandle } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Henleggelsesårsak, OverførtTil } from './behandlingTyper'

interface HenleggFormProps {
  onHenleggelse(): void
  onSave(årsak: Henleggelsesårsak | undefined, begrunnelse?: string): void
  onOverføringValgt(): void
  defaultÅrsak?: Henleggelsesårsak
  defaultBegrunnelse?: string
  overføringTilGosys?: boolean
}

type FormÅrsak = Henleggelsesårsak | OverførtTil.GOSYS

export interface HenleggFormValues {
  årsak: FormÅrsak
  begrunnelse: string
}

export interface HenleggFormHandle {
  validate(): Promise<boolean>
  submit(): Promise<boolean>
  erOverføring(): boolean
}

export const HenleggForm = forwardRef<HenleggFormHandle, HenleggFormProps>(
  ({ onHenleggelse, onSave, onOverføringValgt, defaultÅrsak, defaultBegrunnelse, overføringTilGosys }, ref) => {
    const { control, handleSubmit, getValues, watch } = useForm<HenleggFormValues>({
      defaultValues: {
        årsak: overføringTilGosys ? OverførtTil.GOSYS : (defaultÅrsak ?? undefined),
        begrunnelse: defaultBegrunnelse ?? '',
      },
    })

    const valgtÅrsak = watch('årsak')
    const erOverføring = valgtÅrsak === OverførtTil.GOSYS

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
      erOverføring: () => getValues('årsak') === OverførtTil.GOSYS,
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
              onChange={(value: FormÅrsak) => {
                field.onChange(value)
                if (value === OverførtTil.GOSYS) {
                  onOverføringValgt()
                } else {
                  onSave(value, getValues('begrunnelse'))
                }
              }}
              error={fieldState.error?.message}
            >
              <Radio value={Henleggelsesårsak.SØKNAD_TRUKKET}>Bruker ønsker å trekke søknaden</Radio>
              <Radio value={Henleggelsesårsak.TRUKKET_AV_BEGRUNNER}>Begrunner ønsker å trekke søknaden</Radio>
              <Radio value={Henleggelsesårsak.FLERE_SØKNADER_SAMME_BEHOV}>
                Det er sendt inn flere søknader på brukeren om samme behov
              </Radio>
              <Radio value={OverførtTil.GOSYS}>
                Søknaden er sendt inn på feil bruker, eller inneholder dokumenter som gjelder andre brukere
              </Radio>
              <Radio value={Henleggelsesårsak.ANNET}>Annet</Radio>
            </RadioGroup>
          )}
        />
        {!erOverføring && (
          <Controller
            name="begrunnelse"
            control={control}
            rules={{
              validate: (value) => {
                if (getValues('årsak') === OverførtTil.GOSYS) return true
                return value?.trim() ? true : 'Du må fylle ut en begrunnelse'
              },
            }}
            render={({ field, fieldState }) => (
              <Textarea
                label="Begrunnelse"
                size="small"
                {...field}
                onBlur={(e) => {
                  field.onBlur()
                  onSave(getValues('årsak') as Henleggelsesårsak, e.target.value)
                }}
                error={fieldState.error?.message}
              />
            )}
          />
        )}
      </VStack>
    )
  }
)

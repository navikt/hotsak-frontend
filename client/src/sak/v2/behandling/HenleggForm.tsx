import { Button, InlineMessage, Radio, RadioGroup, Textarea, VStack } from '@navikt/ds-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Henleggelsesårsak, OverførtTil } from './behandlingTyper'
import { ForhåndsvisDokumentModal } from '../../../felleskomponenter/dokument/ForhåndsvisDokumentModal'
import { useNotater } from '../../notat/useNotater'

interface HenleggFormProps {
  onHenleggelse(): void
  onSave(årsak: Henleggelsesårsak | undefined, begrunnelse?: string): void
  onOverføringValgt(): void
  defaultÅrsak?: Henleggelsesårsak
  defaultBegrunnelse?: string
  overføringTilGosys?: boolean
  sakId: string
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
  ({ onHenleggelse, onSave, onOverføringValgt, defaultÅrsak, defaultBegrunnelse, overføringTilGosys, sakId }, ref) => {
    const { control, handleSubmit, getValues, watch, setValue } = useForm<HenleggFormValues>({
      defaultValues: {
        årsak: overføringTilGosys ? OverførtTil.GOSYS : (defaultÅrsak ?? undefined),
        begrunnelse: defaultBegrunnelse ?? '',
      },
    })

    const valgtÅrsak = watch('årsak')
    const erOverføringEllerAvtaltMedBruker =
      valgtÅrsak === OverførtTil.GOSYS || valgtÅrsak === Henleggelsesårsak.SØKNAD_TRUKKET || valgtÅrsak == undefined
    const årsakerMedBegrunnelse: FormÅrsak[] = [
      Henleggelsesårsak.TRUKKET_AV_BEGRUNNER,
      Henleggelsesårsak.FLERE_SØKNADER_SAMME_BEHOV,
      Henleggelsesårsak.ANNET,
    ]
    const [visForhåndsvisning, setVisForhåndsvisning] = useState(false)
    const { forhåndsvisning } = useNotater(sakId)

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
                if (!årsakerMedBegrunnelse.includes(value)) {
                  setValue('begrunnelse', '')
                }
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
        {!erOverføringEllerAvtaltMedBruker && (
          <>
            <Controller
              name="begrunnelse"
              control={control}
              rules={{
                validate: (value) => {
                  if (
                    getValues('årsak') === OverførtTil.GOSYS ||
                    getValues('årsak') === Henleggelsesårsak.SØKNAD_TRUKKET
                  )
                    return true
                  return value?.trim() ? true : 'Du må fylle ut en begrunnelse'
                },
              }}
              render={({ field, fieldState }) => (
                <Textarea
                  label="Begrunn hvorfor saken lukkes"
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
            <InlineMessage status="info" size="small">
              Begrunnelsen lagres som et internt forvaltningsnotat og kan bli utlevert til innbygger ved forespørsel om
              innsyn
            </InlineMessage>
            <div>
              <Button
                type="button"
                size="xsmall"
                variant="tertiary"
                onClick={async () => {
                  await forhåndsvisning.trigger({ tekst: getValues('begrunnelse') })
                  setVisForhåndsvisning(true)
                }}
              >
                Forhåndsvis dokument
              </Button>
            </div>
          </>
        )}
        <ForhåndsvisDokumentModal
          data={forhåndsvisning.data}
          open={visForhåndsvisning}
          onOpenChange={setVisForhåndsvisning}
        />
      </VStack>
    )
  }
)

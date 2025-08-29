import '@mdxeditor/editor/style.css'
import { TextField, VStack } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Notat } from '../../../types/types.internal.ts'
import { Lagreindikator } from './markdown/Lagreindikator.tsx'
import { MarkdownTextArea } from './markdown/MarkdownTextArea.tsx'
import { NotatFormValues } from './Notater.tsx'

export interface NotatFormProps {
  readOnly: boolean
  aktivtUtkast?: Notat
  lagrerUtkast: boolean
}

export function NotatForm({ readOnly, aktivtUtkast, lagrerUtkast }: NotatFormProps) {
  const {
    control,
    formState: { errors },
    trigger,
  } = useFormContext<NotatFormValues>()

  return (
    <>
      <Controller
        name="tittel"
        control={control}
        rules={{ required: 'Du må skrive en tittel' }}
        render={({ field }) => (
          <TextField
            size="small"
            label="Tittel"
            error={errors.tittel?.message}
            readOnly={readOnly}
            value={field.value}
            onChange={(e) => {
              field.onChange(e)
              return trigger('tittel')
            }}
          />
        )}
      />
      <VStack>
        <Controller
          name="tekst"
          control={control}
          rules={{ required: 'Du må skrive en tekst' }}
          render={({ field }) => (
            <MarkdownTextArea
              label="Notat"
              tekst={field.value}
              onChange={(e) => {
                field.onChange(e)
                return trigger('tekst')
              }}
              readOnly={readOnly}
              valideringsfeil={errors.tekst?.message}
            />
          )}
        />
        <Lagreindikator lagrerUtkast={lagrerUtkast} sistLagretTidspunkt={aktivtUtkast?.oppdatert} />
      </VStack>
    </>
  )
}

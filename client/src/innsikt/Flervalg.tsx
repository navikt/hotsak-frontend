import type { IFlervalg } from './spørreundersøkelser'
import { Checkbox, CheckboxGroup } from '@navikt/ds-react'
import { Controller, get, useFormContext } from 'react-hook-form'
import { Fragment } from 'react'
import { join, sanitize } from './Besvarelse'
import { Oppfølgingsspørsmål } from './Oppfølgingsspørsmål'
import type { SpørsmålProps } from './Spørsmål'

const defaultValue: string[] = []

export function Flervalg(props: SpørsmålProps<IFlervalg>) {
  const {
    spørsmål: { tekst, beskrivelse, alternativer, påkrevd },
    navn,
    nivå = 0,
    size,
  } = props
  const name = join(navn, sanitize(tekst), 'svar')
  const { control, formState } = useFormContext()
  const error = get(formState.errors, name)
  return (
    <Controller
      name={name}
      rules={{ required: påkrevd && 'Må fylles ut' }}
      shouldUnregister={true}
      defaultValue={defaultValue}
      control={control}
      render={({ field }) => (
        <CheckboxGroup
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          size={size}
          legend={tekst}
          description={beskrivelse}
          error={error?.message}
        >
          {alternativer.map((alternativ) => {
            if (typeof alternativ === 'string') {
              return (
                <Checkbox key={alternativ} name={name} value={alternativ}>
                  {alternativ}
                </Checkbox>
              )
            } else {
              const spørsmål = alternativ
              return (
                <Fragment key={spørsmål.tekst}>
                  <Checkbox name={name} value={spørsmål.tekst}>
                    {spørsmål.tekst}
                  </Checkbox>
                  {Array.isArray(field.value) && field.value.some((value) => spørsmål.tekst === value) && (
                    <Oppfølgingsspørsmål
                      spørsmål={spørsmål}
                      navn={join(navn, sanitize(tekst), 'oppfølgingsspørsmål')}
                      nivå={nivå + 1}
                    />
                  )}
                </Fragment>
              )
            }
          })}
        </CheckboxGroup>
      )}
    />
  )
}

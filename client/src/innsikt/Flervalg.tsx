import type { IFlervalg } from './spørreundersøkelser'
import { Checkbox, CheckboxGroup } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Fragment } from 'react'
import { join } from './Besvarelse'
import { Oppfølgingsspørsmål } from './Oppfølgingsspørsmål'
import type { SpørsmålProps } from './Spørsmål'

const defaultValue: string[] = []

export function Flervalg(props: SpørsmålProps<IFlervalg>) {
  const {
    spørsmål: { tekst, svar, påkrevd },
    navn,
    nivå = 0,
    size,
  } = props
  const name = join(navn, tekst, 'svar')
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      rules={{ required: påkrevd }}
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
        >
          {svar.map((svar) => {
            if (typeof svar === 'string') {
              return (
                <Checkbox key={svar} name={name} value={svar}>
                  {svar}
                </Checkbox>
              )
            } else {
              const spørsmål = svar
              return (
                <Fragment key={spørsmål.tekst}>
                  <Checkbox name={name} value={spørsmål.tekst}>
                    {spørsmål.tekst}
                  </Checkbox>
                  {Array.isArray(field.value) && field.value.some((value) => spørsmål.tekst === value) && (
                    <Oppfølgingsspørsmål
                      spørsmål={spørsmål}
                      navn={join(navn, tekst, 'oppfølgingsspørsmål')}
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

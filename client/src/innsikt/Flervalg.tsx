import type { IFlervalg } from './spørreundersøkelser'
import { Checkbox, CheckboxGroup } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Fragment } from 'react'
import { join } from './Besvarelse'
import { Oppfølgingsspørsmål } from './Oppfølgingsspørsmål'
import type { SpørsmålProps } from './Spørsmål'

export function Flervalg(props: SpørsmålProps<IFlervalg>) {
  const {
    spørsmål: { tekst, svar, påkrevd },
    nivå = 0,
    size,
  } = props
  const navn = join(props.navn, tekst, 'svar')
  const { control } = useFormContext()
  return (
    <Controller
      name={navn}
      rules={{ required: påkrevd }}
      control={control}
      render={({ field }) => (
        <CheckboxGroup
          size={size}
          legend={tekst}
          onChange={(value) => {
            field.onChange(value)
          }}
        >
          {svar.map((svar) => {
            if (typeof svar === 'string') {
              return (
                <Checkbox key={svar} name={navn} value={svar}>
                  {svar}
                </Checkbox>
              )
            } else {
              const spørsmål = svar
              return (
                <Fragment key={spørsmål.tekst}>
                  <Checkbox name={navn} value={spørsmål.tekst}>
                    {spørsmål.tekst}
                  </Checkbox>
                  {Array.isArray(field.value) && field.value.some((value) => spørsmål.tekst === value) && (
                    <Oppfølgingsspørsmål spørsmål={spørsmål} navn={join(props.navn, tekst)} nivå={nivå + 1} />
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

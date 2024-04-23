import type { IEnkeltvalg } from './spørreundersøkelser'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Fragment } from 'react'
import { join, sanitize } from './Besvarelse'
import { Oppfølgingsspørsmål } from './Oppfølgingsspørsmål'
import type { SpørsmålProps } from './Spørsmål'

export function Enkeltvalg(props: SpørsmålProps<IEnkeltvalg>) {
  const {
    spørsmål: { tekst, beskrivelse, svar, påkrevd },
    navn,
    nivå = 0,
    size,
  } = props
  const name = join(navn, sanitize(tekst), 'svar')
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      rules={{ required: påkrevd }}
      shouldUnregister={true}
      defaultValue={''}
      control={control}
      render={({ field }) => (
        <RadioGroup
          name={field.name}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          size={size}
          legend={tekst}
          description={beskrivelse}
        >
          {svar.map((svar) => {
            if (typeof svar === 'string') {
              return (
                <Radio key={svar} name={name} value={svar}>
                  {svar}
                </Radio>
              )
            } else {
              const spørsmål = svar
              return (
                <Fragment key={spørsmål.tekst}>
                  <Radio name={name} value={spørsmål.tekst}>
                    {spørsmål.tekst}
                  </Radio>
                  {field.value === spørsmål.tekst && (
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
        </RadioGroup>
      )}
    />
  )
}

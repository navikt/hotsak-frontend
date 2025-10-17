import { Radio, RadioGroup } from '@navikt/ds-react'
import { Fragment } from 'react'
import { Controller, get, useFormContext } from 'react-hook-form'
import { joinToName, sanitizeName } from './Besvarelse'
import { Oppfølgingsspørsmål } from './Oppfølgingsspørsmål'
import { IEnkeltvalg, isOppfølgingsspørsmål } from './spørreundersøkelser'
import type { SpørsmålProps } from './Spørsmål'

export function Enkeltvalg(props: SpørsmålProps<IEnkeltvalg>) {
  const {
    spørsmål: { tekst, beskrivelse, alternativer, påkrevd },
    navn,
    nivå = 0,
    size,
  } = props
  const name = joinToName(navn, sanitizeName(tekst), 'svar')
  const { control, formState } = useFormContext()
  const error = get(formState.errors, name)
  return (
    <Controller
      name={name}
      rules={{ required: påkrevd === true ? 'Må fylles ut' : påkrevd }}
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
          error={error?.message}
        >
          {alternativer.map((alternativ) => {
            if (isOppfølgingsspørsmål(alternativ)) {
              const spørsmål = alternativ
              return (
                <Fragment key={spørsmål.tekst}>
                  <Radio name={name} value={spørsmål.tekst}>
                    {spørsmål.tekst}
                  </Radio>
                  {field.value === spørsmål.tekst && (
                    <Oppfølgingsspørsmål
                      spørsmål={spørsmål}
                      navn={joinToName(navn, sanitizeName(tekst), 'oppfølgingsspørsmål')}
                      nivå={nivå + 1}
                    />
                  )}
                </Fragment>
              )
            } else {
              return (
                <Radio key={alternativ} name={name} value={alternativ}>
                  {alternativ}
                </Radio>
              )
            }
          })}
        </RadioGroup>
      )}
    />
  )
}

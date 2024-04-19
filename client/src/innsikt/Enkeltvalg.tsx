import type { IEnkeltvalg } from './spørreundersøkelser'
import { Radio, RadioGroup } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { Fragment } from 'react'
import { join } from './Besvarelse'
import { Oppfølgingsspørsmål } from './Oppfølgingsspørsmål'
import type { SpørsmålProps } from './Spørsmål'

export function Enkeltvalg(props: SpørsmålProps<IEnkeltvalg>) {
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
        <RadioGroup
          size={size}
          legend={tekst}
          onChange={(value) => {
            field.onChange(value)
          }}
        >
          {svar.map((svar) => {
            if (typeof svar === 'string') {
              return (
                <Radio key={svar} name={navn} value={svar}>
                  {svar}
                </Radio>
              )
            } else {
              const spørsmål = svar
              return (
                <Fragment key={spørsmål.tekst}>
                  <Radio name={navn} value={spørsmål.tekst}>
                    {spørsmål.tekst}
                  </Radio>
                  {field.value === spørsmål.tekst && (
                    <Oppfølgingsspørsmål spørsmål={spørsmål} navn={join(props.navn, tekst)} nivå={nivå + 1} />
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

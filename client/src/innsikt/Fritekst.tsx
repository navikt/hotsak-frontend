import type { IFritekst } from './spørreundersøkelser'
import { Textarea } from '@navikt/ds-react'
import { useFormContext, get } from 'react-hook-form'
import { joinToName, sanitizeName } from './Besvarelse'
import type { SpørsmålProps } from './Spørsmål'

export function Fritekst(props: SpørsmålProps<IFritekst>) {
  const {
    spørsmål: { tekst, beskrivelse, påkrevd },
    navn,
    size,
  } = props
  const name = joinToName(navn, sanitizeName(tekst), 'svar')
  const { register, formState } = useFormContext()
  const error = get(formState.errors, name)
  return (
    <Textarea
      size={size}
      label={tekst}
      description={beskrivelse}
      error={error?.message}
      {...register(name, { required: påkrevd && 'Må fylles ut', maxLength: 1000, shouldUnregister: true })}
    />
  )
}

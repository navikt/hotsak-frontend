import type { IFritekst } from './spørreundersøkelser'
import { Textarea } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { join, sanitize } from './Besvarelse'
import type { SpørsmålProps } from './Spørsmål'

export function Fritekst(props: SpørsmålProps<IFritekst>) {
  const {
    spørsmål: { tekst, beskrivelse, påkrevd },
    navn,
    size,
  } = props
  const name = join(navn, sanitize(tekst), 'svar')
  const { register } = useFormContext()
  return (
    <Textarea
      size={size}
      label={tekst}
      description={beskrivelse}
      {...register(name, { required: påkrevd, maxLength: 1000, shouldUnregister: true })}
    />
  )
}

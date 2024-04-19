import type { IFritekst } from './spørreundersøkelser'
import { Textarea } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { join } from './Besvarelse'
import type { SpørsmålProps } from './Spørsmål'

export function Fritekst(props: SpørsmålProps<IFritekst>) {
  const {
    spørsmål: { tekst, beskrivelse, påkrevd },
    size,
  } = props
  const navn = join(props.navn, tekst, 'svar')
  const { register } = useFormContext()
  return <Textarea size={size} label={tekst} description={beskrivelse} {...register(navn, { required: påkrevd })} />
}

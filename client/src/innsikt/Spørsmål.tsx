import type { IEnkeltvalg, IFlervalg, IFritekst } from './spørreundersøkelser'
import { Enkeltvalg } from './Enkeltvalg'
import { Flervalg } from './Flervalg'
import { Fritekst } from './Fritekst'

export interface SpørsmålProps<T> {
  spørsmål: T
  navn?: string
  nivå?: number
  size?: 'medium' | 'small'
}

export function Spørsmål(props: SpørsmålProps<IEnkeltvalg | IFlervalg | IFritekst>) {
  const { spørsmål, ...rest } = props
  switch (spørsmål.type) {
    case 'enkeltvalg':
      return <Enkeltvalg spørsmål={spørsmål} {...rest} />
    case 'flervalg':
      return <Flervalg spørsmål={spørsmål} {...rest} />
    case 'fritekst':
      return <Fritekst spørsmål={spørsmål} {...rest} />
    default:
      return null
  }
}

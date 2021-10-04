import { Varsel, Varseltype } from '@navikt/helse-frontend-varsel'

interface FeilmeldingVarselProps {
  error: Error
}

export const FeilmeldingVarsel = (props: FeilmeldingVarselProps) => {
  const { error } = props
  return <Varsel type={Varseltype.Advarsel}>{error.message}</Varsel>
}

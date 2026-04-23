import { HttpError } from '../../io/HttpError.ts'
import { FeilmeldingAlert } from './FeilmeldingAlert.tsx'

export function PersonFeilmelding({ personError }: { personError: unknown }) {
  if (HttpError.isHttpError(personError) && personError.isForbidden()) {
    return <FeilmeldingAlert>Du har ikke tilgang til å se informasjon om denne brukeren</FeilmeldingAlert>
  } else if (HttpError.isHttpError(personError) && personError.isNotFound()) {
    return <FeilmeldingAlert>Person ikke funnet i PDL</FeilmeldingAlert>
  } else {
    return <FeilmeldingAlert>Teknisk feil. Klarte ikke å hente person fra PDL.</FeilmeldingAlert>
  }
}

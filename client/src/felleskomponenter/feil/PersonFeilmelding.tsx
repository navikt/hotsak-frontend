import { Feilmelding } from './Feilmelding'

export function PersonFeilmelding({ personError }: { personError: any }) {
  if (personError.statusCode === 403) {
    return <Feilmelding>Du har ikke tilgang til å se informasjon om denne brukeren</Feilmelding>
  } else if (personError.statusCode === 404) {
    return <Feilmelding>Person ikke funnet i PDL</Feilmelding>
  } else {
    return <Feilmelding>Teknisk feil. Klarte ikke å hente person fra PDL.</Feilmelding>
  }
}

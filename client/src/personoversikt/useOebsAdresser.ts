import useSwr from 'swr'
import { hentBrukerdataMedPost } from '../io/http'
import type { Adresse } from '../types/types.internal'

export interface OebsAdresse {
  brukernummer: string
  leveringsadresse: Adresse
  primæradresse: string
  bydel?: string
}

export function useOebsAdresser(visOebsAdresser: boolean, brukersFodselsnummer?: string) {
  const { data } = useSwr<{ data: OebsAdresse[] }>(
    window.appSettings.MILJO !== 'prod-gcp' && visOebsAdresser && brukersFodselsnummer
      ? ['api/person/oebs-adresser', brukersFodselsnummer]
      : null,
    hentBrukerdataMedPost
  )
  return { adresser: data?.data ?? [] }
}

import useSwr from 'swr'
import { hentBrukerdataMedPost } from '../io/http'

export interface OebsAdresse {
  brukerNr: string
  leveringAddresse: string
  leveringKommune: string
  leveringPostnr: string
  leveringBy: string
  primærAdr: boolean
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

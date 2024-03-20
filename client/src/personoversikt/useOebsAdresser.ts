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

export function useOebsAdresser(brukersFodselsnummer?: string) {
  const { data } = useSwr<{ data: OebsAdresse[] }>(
    brukersFodselsnummer ? ['api/person/oebs-adresser', brukersFodselsnummer] : null,
    hentBrukerdataMedPost
  )
  return { adresser: data?.data ?? [] }
}

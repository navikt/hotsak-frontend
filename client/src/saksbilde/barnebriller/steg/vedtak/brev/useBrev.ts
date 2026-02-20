import { useCallback, useState } from 'react'

import { useDokumentContext } from '../../../../../dokument/DokumentContext.tsx'
import { http } from '../../../../../io/HttpClient.ts'
import { HttpError } from '../../../../../io/HttpError.ts'
import {
  byggDataRessurs,
  byggFeiletRessurs,
  byggHenterRessurs,
  byggTomRessurs,
} from '../../../../../io/ressursFunksjoner.ts'
import { Brevtype, Ressurs } from '../../../../../types/types.internal.ts'

export interface UseBrevResponse {
  hentedeBrev: Record<Brevtype, Ressurs<string>>
  brevError: HttpError | null
  hentForhåndsvisning(sakId: number | string, brevtype: Brevtype, notatId?: string): void
  nullstillBrev(brevtype: Brevtype): void
}

// todo -> flytt denne til mer egnet mappe, den brukes ikke bare for vedtaksbrev
export function useBrev(): UseBrevResponse {
  const { hentedeBrev, settHentetBrev } = useDokumentContext()
  const [brevError, setBrevError] = useState<HttpError | null>(null)

  const nullstillBrev = useCallback(
    (brevtype: Brevtype) => {
      settHentetBrev(brevtype, byggTomRessurs())
    },
    [settHentetBrev]
  )

  const hentForhåndsvisning = useCallback(
    (sakId: number | string, brevtype: Brevtype = Brevtype.BARNEBRILLER_VEDTAK, notatId?: string) => {
      settHentetBrev(brevtype, byggHenterRessurs())
      setBrevError(null)

      const url =
        brevtype === Brevtype.JOURNALFØRT_NOTAT && notatId
          ? `/api/sak/${sakId}/notater/${notatId}`
          : `/api/sak/${sakId}/brev/${brevtype}`

      http
        .get<Blob>(url, { accept: 'application/pdf' })
        .then((data) => {
          settHentetBrev(brevtype, byggDataRessurs(window.URL.createObjectURL(data)))
          setBrevError(null)
        })
        .catch((error: HttpError) => {
          settHentetBrev(brevtype, byggFeiletRessurs(`Ukjent feil, kunne ikke generere forhåndsvisning: ${error}`))
          setBrevError(error)
        })
    },
    [settHentetBrev]
  )

  return {
    hentedeBrev,
    brevError,
    hentForhåndsvisning,
    nullstillBrev,
  }
}

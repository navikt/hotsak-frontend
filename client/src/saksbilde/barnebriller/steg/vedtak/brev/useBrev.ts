import { useCallback, useState } from 'react'

import { httpGetPdf, PDFResponse } from '../../../../../io/http'
import { useDokumentContext } from '../../../../../dokument/DokumentContext'
import {
  byggDataRessurs,
  byggFeiletRessurs,
  byggHenterRessurs,
  byggTomRessurs,
} from '../../../../../io/ressursFunksjoner'

import { Brevtype, Ressurs } from '../../../../../types/types.internal'

interface BrevResponse {
  //isLoading: boolean
  //isError: any
  isDokumentError: any
  hentForhåndsvisning(sakId: number | string, brevtype: Brevtype, notatId?: string): any
  nullstillDokument(brevtype: Brevtype): any
  hentedeBrev: Record<Brevtype, Ressurs<string>>
}

export function useBrev(): BrevResponse {
  const { hentedeBrev, settHentetBrev } = useDokumentContext()
  const [isDokumentError, setIsDokumentError] = useState<any>(null)

  const nullstillDokument = (brevtype: Brevtype) => {
    settHentetBrev(brevtype, byggTomRessurs())
  }

  const hentForhåndsvisning = useCallback(
    (sakId: number | string, brevtype: Brevtype = Brevtype.BARNEBRILLER_VEDTAK, notatId?: string) => {
      settHentetBrev(brevtype, byggHenterRessurs())
      setIsDokumentError(null)

      let response
      if (brevtype === Brevtype.JOURNALFØRT_NOTAT && notatId) {
        response = httpGetPdf(`api/sak/${sakId}/notater/${notatId}`)
      } else {
        response = httpGetPdf(`api/sak/${sakId}/brev/${brevtype}`)
      }

      response
        .then((response: PDFResponse) => {
          settHentetBrev(brevtype, byggDataRessurs(window.URL.createObjectURL(response.data)))
          setIsDokumentError(null)
        })
        .catch((error: any) => {
          settHentetBrev(brevtype, byggFeiletRessurs(`Ukjent feil, kunne ikke generer forhåndsvisning: ${error}`))
          setIsDokumentError(error)
        })
    },
    [settHentetBrev]
  )
  return {
    isDokumentError,
    hentForhåndsvisning,
    nullstillDokument,
    hentedeBrev,
    //mutate,
  }
}

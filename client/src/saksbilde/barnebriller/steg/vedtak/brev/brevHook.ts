import React, { useState } from 'react'

import { httpGetPdf, PDFResponse } from '../../../../../io/http'
import {
  byggDataRessurs,
  byggFeiletRessurs,
  byggHenterRessurs,
  byggTomRessurs,
} from '../../../../../oppgaveliste/dokumenter/ressursFunksjoner'

import { Ressurs } from '../../../../../types/types.internal'

interface BrevResponse {
  //isLoading: boolean
  //isError: any
  isDokumentError: any
  hentForhåndsvisning: (sakId: string) => any
  nullstillDokument: () => any
  hentetDokument: any
  settHentetDokument: any
  // mutate: (...args: any[]) => any
}

export function useBrev(sakID?: string): BrevResponse {
  //const { data, error, mutate } = useSwr<{ data: Journalpost }>(`api/sak/${sakID}/brev/forhandsvisning`, httpGet)
  //const [valgtDokumentID, settValgtDokumentID] = React.useState<string>('')
  const [hentetDokument, settHentetDokument] = React.useState<Ressurs<string>>(byggTomRessurs())
  const [isDokumentError, setIsDokumentError] = useState<any>(null)

  const nullstillDokument = () => {
    settHentetDokument(byggTomRessurs)
  }

  const hentForhåndsvisning = (sakID: string) => {
    settHentetDokument(byggHenterRessurs())
    setIsDokumentError(null)

    const response = httpGetPdf(`api/sak/${sakID}/brev`)

    response
      .then((response: PDFResponse) => {
        settHentetDokument(byggDataRessurs(window.URL.createObjectURL(response.data)))
        setIsDokumentError(null)
      })
      .catch((error: any) => {
        settHentetDokument(byggFeiletRessurs(`Ukjent feil, kunne ikke generer forhåndsvisning: ${error}`))
        setIsDokumentError(error)
      })
  }

  return {
    //journalpost: data?.data,
    //isLoading: !error && !data,
    //isError: error,
    isDokumentError,
    hentForhåndsvisning,
    nullstillDokument,
    hentetDokument,
    settHentetDokument,
    //mutate,
  }
}

import { useEffect } from 'react'

import { FeilmeldingAlert } from '../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { Toast } from '../felleskomponenter/toast/Toast'
import { RessursStatus } from '../types/types.internal'
import { useDokumentContext } from './DokumentContext'
import { useDokument } from './useDokument'
import classes from './DokumentPanel.module.css'

export function DokumentPanel() {
  const { hentetDokument, dokumentError, hentForhåndsvisning } = useDokument()
  const { valgtDokument } = useDokumentContext()

  const { journalpostId, dokumentId } = valgtDokument

  useEffect(() => {
    if (journalpostId && dokumentId) {
      hentForhåndsvisning(journalpostId, dokumentId)
    }
  }, [journalpostId, dokumentId, hentForhåndsvisning])

  if (dokumentError) {
    return (
      <div className={classes.feilmeldingContainer}>
        <div>
          <FeilmeldingAlert>Det oppstod en feil ved henting av dokument.</FeilmeldingAlert>
        </div>
      </div>
    )
  } else if (hentetDokument.status === RessursStatus.HENTER) {
    return (
      <div className={classes.feilmeldingContainer}>
        <div>
          <Toast>Henter dokument...</Toast>
        </div>
      </div>
    )
  } else
    return (
      <div className={classes.dokumentContainer}>
        {hentetDokument.status === RessursStatus.SUKSESS && (
          <iframe title={'dokument'} src={hentetDokument.data} width={'100%'} height={'100%'}></iframe>
        )}
      </div>
    )
}

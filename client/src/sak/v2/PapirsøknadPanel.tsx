import { useEffect } from 'react'

import { useDokumentContext } from '../../dokument/DokumentContext'
import { DokumentPanel } from '../../dokument/DokumentPanel'
import { useJournalposter } from '../../saksbilde/useJournalposter'
import classes from './PapirsøknadPanel.module.css'

export function PapirsøknadPanel() {
  const { dokumenter } = useJournalposter()
  const { setValgtDokument } = useDokumentContext()

  const journalpostId = dokumenter[0]?.journalpostId
  const dokumentId = dokumenter[0]?.dokumentId

  useEffect(() => {
    if (journalpostId && dokumentId) {
      setValgtDokument({ journalpostId, dokumentId })
    }
  }, [journalpostId, dokumentId, setValgtDokument])

  return (
    <div className={classes.container}>
      <DokumentPanel />
    </div>
  )
}

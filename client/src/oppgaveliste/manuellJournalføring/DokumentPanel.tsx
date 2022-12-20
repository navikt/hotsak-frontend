import { useEffect } from 'react'
import styled from 'styled-components'

import { RessursStatus } from '../../types/types.internal'
import { useDokumentContext } from '../dokumenter/DokumentContext'
import { useDokument } from '../dokumenter/dokumentHook'

const DokumentDiv = styled.div`
  width: 100%;
  height: 100%;
`

export const DokumentPanel: React.FC = () => {
  const { journalpost, hentetDokument, hentForhåndsvisning } = useDokument()
  const { valgtDokumentID } = useDokumentContext()

  const journalpostID = journalpost?.journalpostID

  useEffect(() => {
    if (journalpostID && valgtDokumentID) {
      console.log('Henter forhåndsvisning')

      hentForhåndsvisning(journalpostID, valgtDokumentID)
    }
  }, [journalpostID, valgtDokumentID])

  if (!journalpostID || !valgtDokumentID) {
    return <div>Mangler journalpostID eller dokumentID </div>
  }

  return (
    <DokumentDiv>
      {hentetDokument.status === RessursStatus.SUKSESS && (
        <iframe title={'dokument'} src={hentetDokument.data} width={'100%'} height={'100%'}></iframe>
      )}
    </DokumentDiv>
  )
}

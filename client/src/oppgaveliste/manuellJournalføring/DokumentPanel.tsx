import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Feilmelding } from '../../felleskomponenter/Feilmelding'
import { Toast } from '../../felleskomponenter/Toast'
import { RessursStatus } from '../../types/types.internal'
import { useDokumentContext } from '../dokumenter/DokumentContext'
import { useDokument } from '../dokumenter/oppgaverHook'

const DokumentDiv = styled.div`
  width: 100%;
  height: 100%;
`

const FeilmeldingDiv = styled.div`
  display: flex;
  justify-content: center;
`
export const DokumentPanel: React.FC = () => {
  const { hentetDokument, hentForhåndsvisning, isPdfError } = useDokument()
  const { valgtDokument } = useDokumentContext()

  const { journalpostID, dokumentID } = valgtDokument

  useEffect(() => {
    if (journalpostID && dokumentID) {
      hentForhåndsvisning(journalpostID, dokumentID)
    }
  }, [journalpostID, dokumentID])

  if (isPdfError) {
    return (
      <FeilmeldingDiv>
        <div>
          <Feilmelding>Det oppstod en feil ved henting av dokument.</Feilmelding>
        </div>
      </FeilmeldingDiv>
    )
  } else if (hentetDokument.status === RessursStatus.HENTER) {
    return (
      <FeilmeldingDiv>
        <div>
          <Toast>Henter dokument...</Toast>
        </div>
      </FeilmeldingDiv>
    )
  } else
    return (
      <DokumentDiv>
        {hentetDokument.status === RessursStatus.SUKSESS && (
          <iframe title={'dokument'} src={hentetDokument.data} width={'100%'} height={'100%'}></iframe>
        )}
      </DokumentDiv>
    )
}

import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Feilmelding } from '../../felleskomponenter/Feilmelding'
import { Toast } from '../../felleskomponenter/Toast'
import { RessursStatus } from '../../types/types.internal'
import { useDokumentContext } from '../dokumenter/DokumentContext'
import { useDokument } from '../dokumenter/dokumentHook'

const DokumentDiv = styled.div`
  width: 100%;
  height: 100%;
`

const FeilmeldingDiv = styled.div`
  display: flex;
  justify-content: center;
`

interface DokumentPanelProps {
  journalpostID?: string
}

export const DokumentPanel: React.FC<DokumentPanelProps> = (props) => {
  const { journalpostID } = props
  const { journalpost, hentetDokument, hentForhåndsvisning, isError, isPdfError } = useDokument(journalpostID)
  const { valgtDokumentID } = useDokumentContext()

  useEffect(() => {
    if (journalpostID && valgtDokumentID) {
      hentForhåndsvisning(journalpostID, valgtDokumentID)
    }
  }, [journalpostID, valgtDokumentID])

  if (!journalpostID || !valgtDokumentID) {
    return <div>Mangler journalpostID eller dokumentID </div>
  } else if (isError || isPdfError) {
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

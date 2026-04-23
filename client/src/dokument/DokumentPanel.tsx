import { useEffect } from 'react'
import styled from 'styled-components'

import { FeilmeldingAlert } from '../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { Toast } from '../felleskomponenter/toast/Toast'
import { RessursStatus } from '../types/types.internal'
import { useDokumentContext } from './DokumentContext'
import { useDokument } from './useDokument'

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
      <FeilmeldingContainer>
        <div>
          <FeilmeldingAlert>Det oppstod en feil ved henting av dokument.</FeilmeldingAlert>
        </div>
      </FeilmeldingContainer>
    )
  } else if (hentetDokument.status === RessursStatus.HENTER) {
    return (
      <FeilmeldingContainer>
        <div>
          <Toast>Henter dokument...</Toast>
        </div>
      </FeilmeldingContainer>
    )
  } else
    return (
      <DokumentContainer>
        {hentetDokument.status === RessursStatus.SUKSESS && (
          <iframe title={'dokument'} src={hentetDokument.data} width={'100%'} height={'100%'}></iframe>
        )}
      </DokumentContainer>
    )
}

const DokumentContainer = styled.div`
  width: 100%;
  height: 100%;
`

const FeilmeldingContainer = styled.div`
  display: flex;
  justify-content: center;
`

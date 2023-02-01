import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Loader } from '@navikt/ds-react'

import { Feilmelding } from '../../felleskomponenter/Feilmelding'
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
  align-items: center;
`

interface DokumentPanelProps {
  journalpostID?: string
}

export const DokumentPanel: React.FC<DokumentPanelProps> = (props) => {
  const { journalpostID } = props
  const { journalpost, hentetDokument, hentForhåndsvisning, isError, isPdfError } = useDokument(journalpostID)
  const { valgtDokumentID } = useDokumentContext()

  //const journalpostID = journalpost?.journalpostID

  console.log('jpid', journalpostID)

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
          <Loader size="3xlarge" title="Henter dokument..." />
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

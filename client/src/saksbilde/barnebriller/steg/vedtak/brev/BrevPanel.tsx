import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Loader } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { Feilmelding } from '../../../../../felleskomponenter/Feilmelding'
import { Etikett } from '../../../../../felleskomponenter/typografi'
import { Brevtype, RessursStatus } from '../../../../../types/types.internal'
import { useBrev } from './brevHook'

const DokumentDiv = styled.div`
  width: 100%;
  height: calc(100vh - 140px);
`

const FeilmeldingDiv = styled.div`
  display: flex;
  justify-content: center;
`

interface BrevPanelProps {
  sakId: number | string
  brevtype: Brevtype
  fullSize: boolean
}

export const BrevPanel: React.FC<BrevPanelProps> = (props) => {
  const { sakId, brevtype, fullSize } = props
  const { hentetDokument, hentForhåndsvisning, isDokumentError } = useBrev()

  useEffect(() => {
    if (sakId) {
      hentForhåndsvisning(sakId, brevtype)
    }
  }, [sakId])

  if (!sakId) {
    return <div>Mangler sakID</div>
  } else if (isDokumentError) {
    {
      /*  TODO Bruke en error boundy her?*/
    }
    return (
      <FeilmeldingDiv>
        <div>
          <Feilmelding>Det oppstod en feil ved opprettelse av brev</Feilmelding>
        </div>
      </FeilmeldingDiv>
    )
  } else if (hentetDokument.status === RessursStatus.HENTER) {
    return (
      <FeilmeldingDiv>
        <Loader size="medium" title="Genererer forhåndsvisning av brev..." />
        <Avstand paddingLeft={4}>
          <Etikett>Genererer forhåndsvisning av brev...</Etikett>
        </Avstand>
      </FeilmeldingDiv>
    )
  } else
    return (
      <div>
        {hentetDokument.status === RessursStatus.SUKSESS && (
          <DokumentIFrame fullSize={fullSize} dokumentData={hentetDokument.data} />
        )}
      </div>
    )
}

const DokumentIFrame = ({ fullSize, dokumentData }: { fullSize: boolean; dokumentData: any }) => {
  if (fullSize) {
    return (
      <DokumentDiv>
        <iframe title={'dokument'} src={dokumentData} width={'100%'} height={'100%'}></iframe>
      </DokumentDiv>
    )
  } else {
    return <StyledIFrame title={'Dokument'} src={dokumentData} tabIndex={0}></StyledIFrame>
  }
}

const StyledIFrame = styled.iframe`
  margin: 0rem 0.5rem;
  aspect-ratio: 1/1.5;
  width: 95%;
`

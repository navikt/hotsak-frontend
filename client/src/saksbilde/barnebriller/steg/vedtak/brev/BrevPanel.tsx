import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Loader } from '@navikt/ds-react'

import { Feilmelding } from '../../../../../felleskomponenter/Feilmelding'
import { RessursStatus } from '../../../../../types/types.internal'
import { useBrev } from './brevHook'

const DokumentDiv = styled.div`
  width: 100%;
  height: 100%;
`

const FeilmeldingDiv = styled.div`
  display: flex;
  justify-content: center;
`

interface BrevPanelProps {
  sakID: string
}

export const BrevPanel: React.FC<BrevPanelProps> = (props) => {
  const { sakID } = props
  const { hentetDokument, hentForhåndsvisning, isDokumentError } = useBrev(sakID)

  useEffect(() => {
    if (sakID) {
      hentForhåndsvisning(sakID)
    }
  }, [sakID])

  if (!sakID) {
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
        <div>
          <Loader size="3xlarge" title="Henter forhåndsvisning av brev..." />
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

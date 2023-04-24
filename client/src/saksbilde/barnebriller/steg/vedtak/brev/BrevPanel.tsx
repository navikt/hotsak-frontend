import React, { useEffect } from 'react'
import styled from 'styled-components'

import { Loader } from '@navikt/ds-react'

import { Avstand } from '../../../../../felleskomponenter/Avstand'
import { Feilmelding } from '../../../../../felleskomponenter/Feilmelding'
import { Etikett } from '../../../../../felleskomponenter/typografi'
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
  sakId: number | string
}

export const BrevPanel: React.FC<BrevPanelProps> = (props) => {
  const { sakId } = props
  const { hentetDokument, hentForhåndsvisning, isDokumentError } = useBrev(sakId)

  useEffect(() => {
    if (sakId) {
      hentForhåndsvisning(sakId)
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
      <DokumentDiv>
        {hentetDokument.status === RessursStatus.SUKSESS && (
          <iframe title={'dokument'} src={hentetDokument.data} width={'100%'} height={'100%'}></iframe>
        )}
      </DokumentDiv>
    )
}

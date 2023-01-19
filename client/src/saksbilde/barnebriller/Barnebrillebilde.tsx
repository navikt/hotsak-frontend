import React from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import styled from 'styled-components'

import { useDokumentContext } from '../../oppgaveliste/dokumenter/DokumentContext'

import { AlertError } from '../../feilsider/AlertError'
import { Oppgavetype, StegType } from '../../types/types.internal'
import { LasterPersonlinje } from '../Personlinje'
import { useBrillesak } from '../sakHook'
import RegistrerSøknad from './steg/søknadsregistrering/RegistrerSøknad'
import { VurderVilkår } from './steg/vilkårsvurdering/VurderVilkår'

const BarnebrilleBildeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`
const BarnebrilleContent: React.FC = React.memo(() => {
  const { sak, isLoading, isError } = useBrillesak()
  const { setValgtDokumentID } = useDokumentContext()
  //const { personInfo, /*isLoading: personInfoLoading,*/ isError: personInfoError } = usePersonInfo(sak?.bruker?.fnr)
  //const { hjelpemiddelArtikler } = useHjelpemiddeloversikt(sak?.personinformasjon.fnr)
  const handleError = useErrorHandler()

  if (isError) {
    handleError(isError)
  }

  if (sak?.sakstype !== Oppgavetype.BARNEBRILLER) {
    throw new Error(
      `Feil ved visning av sak. Forventer at sak skal være av type BARNEBRILLER, men var ${sak?.sakstype} `
    )
  }

  if (!sak) return <div>Fant ikke saken</div>

  switch (sak.steg) {
    case StegType.INNHENTE_FAKTA:
      return <RegistrerSøknad />
    case StegType.VURDERE_VILKÅR:
      return <VurderVilkår />
    default:
      return <div>Ikke implementert enda</div>
  }
})

const LasterBarnebrilleBilde = () => (
  <BarnebrilleBildeContainer>
    <LasterPersonlinje />
  </BarnebrilleBildeContainer>
)

export const BarnebrilleBilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterBarnebrilleBilde />}>
      <BarnebrilleContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default BarnebrilleBilde

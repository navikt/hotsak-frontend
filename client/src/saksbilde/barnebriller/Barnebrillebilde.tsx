import React, { useState } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import styled from 'styled-components'

import { headerHøydeRem, hotsakTotalMinWidth } from '../../GlobalStyles'
import { AlertError } from '../../feilsider/AlertError'
import { Flex } from '../../felleskomponenter/Flex'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { HøyrekolonneTabs, Oppgavetype } from '../../types/types.internal'
import { LasterPersonlinje, Personlinje } from '../Personlinje'
import { Høyrekolonne } from '../høyrekolonne/Høyrekolonne'
import { useBrillesak } from '../sakHook'
import { VenstreMeny } from '../venstremeny/Venstremeny'
import { RegistrerSøknad } from './RegistrerSøknad'
import { Stegindikator } from './Stegindikator'

const BestillingsbildeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`

const TreKolonner = styled.div`
  display: grid;
  grid-template-columns: 40rem 1fr 25rem;
  grid-template-rows: 1fr;
  height: calc(100vh - ${headerHøydeRem}rem);
`

const Container = styled(Flex)`
  flex: 1;
  min-width: ${hotsakTotalMinWidth};
  overflow: auto;
  overflow-x: hidden;
`

const AutoFlexContainer = styled.div`
  flex: auto;
`

const Content = styled.section`
  padding: 0 1.4rem;

  padding-top: 1rem;
  height: 100%;
  box-sizing: border-box;
`

const BarnebrilleContent: React.FC = React.memo(() => {
  const [høyrekolonneTab, setHøyrekolonneTab] = useState(HøyrekolonneTabs.SAKSHISTORIKK)
  const { sak, isLoading, isError } = useBrillesak()
  const { personInfo, /*isLoading: personInfoLoading,*/ isError: personInfoError } = usePersonInfo(sak?.bruker?.fnr)
  //const { hjelpemiddelArtikler } = useHjelpemiddeloversikt(sak?.personinformasjon.fnr)
  const handleError = useErrorHandler()

  console.log(`Sak ${sak?.bruker}`)

  if (isLoading) return <LasterBarnebrilleBilde />

  if (isError) {
    handleError(isError)
  }

  if (sak?.sakstype !== Oppgavetype.BARNEBRILLER) {
    throw new Error(
      `Feil ved visning av sak. Forventer at sak skal være av type BARNEBRILLER, men var ${sak?.sakstype} `
    )
  }

  //const harIngenHjelpemidlerFraFør = hjelpemiddelArtikler !== undefined && hjelpemiddelArtikler.length === 0

  if (!sak) return <div>Fant ikke saken</div>

  return (
    <BestillingsbildeContainer>
      <Personlinje person={personInfo} />
      <Stegindikator />
      <Container>
        <TreKolonner>
          <VenstreMeny width="35rem">
            <RegistrerSøknad />
          </VenstreMeny>
          <div>PDF her</div>
          {/* Sakshistorikk */}
          <Høyrekolonne currentTab={høyrekolonneTab} oppgavetype={Oppgavetype.BESTILLING} />
        </TreKolonner>
      </Container>
    </BestillingsbildeContainer>
  )
})

const LasterBarnebrilleBilde = () => (
  <BestillingsbildeContainer className="saksbilde" data-testid="laster-saksbilde">
    <LasterPersonlinje />
  </BestillingsbildeContainer>
)

export const BarnebrilleBilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterBarnebrilleBilde />}>
      <BarnebrilleContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default BarnebrilleBilde

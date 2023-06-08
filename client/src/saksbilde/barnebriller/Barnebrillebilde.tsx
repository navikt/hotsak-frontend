import React, { useEffect } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { Tabs } from '@navikt/ds-react'

import { brilleSidebarBredde } from '../../GlobalStyles'
import { AlertError } from '../../feilsider/AlertError'
import { Oppgavetype, StegType } from '../../types/types.internal'
import { LasterPersonlinje } from '../Personlinje'
import { useBrillesak } from '../sakHook'
import { BarnebrilleSidebar } from './BarnebrilleSidebar'
import { ManuellSaksbehandlingProvider, useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import RegistrerSøknad from './steg/søknadsregistrering/RegistrerSøknad'
import { Vedtak } from './steg/vedtak/Vedtak'
import { VurderVilkår } from './steg/vilkårsvurdering/VurderVilkår'

const BarnebrilleBildeContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`
const BarnebrilleContent: React.FC = React.memo(() => {
  const { sak, isLoading, isError } = useBrillesak()
  const { valgtTab, setValgtTab } = useManuellSaksbehandlingContext()
  const { showBoundary } = useErrorBoundary()

  if (isError) {
    showBoundary(isError)
  }

  useEffect(() => {
    if (sak) {
      if (
        sak.steg === StegType.GODKJENNE ||
        sak.steg === StegType.FERDIG_BEHANDLET ||
        sak.steg === StegType.REVURDERE
      ) {
        setValgtTab(StegType.INNHENTE_FAKTA)
      } else {
        setValgtTab(sak?.steg)
      }
    }
  }, [])

  if (sak?.sakstype !== Oppgavetype.BARNEBRILLER) {
    throw new Error(
      `Feil ved visning av sak. Forventer at sak skal være av type BARNEBRILLER, men var ${sak?.sakstype} `
    )
  }

  if (!sak) return <div>Fant ikke saken</div>

  return (
    <>
      <Tabs defaultValue={StegType.INNHENTE_FAKTA.toString()} value={valgtTab} loop onChange={setValgtTab}>
        <Tabs.List>
          <Tabs.Tab value={StegType.INNHENTE_FAKTA.toString()} label="1. Registrer søknad" />
          <Tabs.Tab value={StegType.VURDERE_VILKÅR.toString()} label="2. Vilkår" />
          <Tabs.Tab value={StegType.FATTE_VEDTAK.toString()} label="3. Vedtak" />
        </Tabs.List>
        <Tabs.Panel value={StegType.INNHENTE_FAKTA.toString()}>
          <RegistrerSøknad />
        </Tabs.Panel>
        <Tabs.Panel value={StegType.VURDERE_VILKÅR.toString()}>
          <VurderVilkår />
        </Tabs.Panel>
        <Tabs.Panel value={StegType.FATTE_VEDTAK.toString()}>
          <Vedtak />
        </Tabs.Panel>
      </Tabs>
    </>
  )
})

const LasterBarnebrilleBilde = () => (
  <BarnebrilleBildeContainer>
    <LasterPersonlinje />
  </BarnebrilleBildeContainer>
)

export const BarnebrilleBilde = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterBarnebrilleBilde />}>
      <ManuellSaksbehandlingProvider>
        <MainGrid>
          <BarnebrilleContent />
          <BarnebrilleSidebar />
        </MainGrid>
      </ManuellSaksbehandlingProvider>
    </React.Suspense>
  </ErrorBoundary>
)

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr ${brilleSidebarBredde};
`

const TabContainer = styled.div`
  padding-top: var(--a-spacing-4);
`

export default BarnebrilleBilde

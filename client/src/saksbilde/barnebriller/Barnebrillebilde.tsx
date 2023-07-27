import React, { useEffect } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Tabs } from '@navikt/ds-react'

import { MenyKnapp } from '../../oppgaveliste/kolonner/MenyKnapp'

import { brilleSidebarBredde } from '../../GlobalStyles'
import { AlertError } from '../../feilsider/AlertError'
import { Oppgavetype, StegType } from '../../types/types.internal'
import { LasterPersonlinje } from '../Personlinje'
import { StatusTag } from '../komponenter/StatusTag'
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
  const { sak, isError, mutate } = useBrillesak()
  const { valgtTab, setValgtTab } = useManuellSaksbehandlingContext()
  const { showBoundary } = useErrorBoundary()

  if (isError) {
    showBoundary(isError)
  }

  useEffect(() => {
    if (sak) {
      if (
        sak.data.steg === StegType.GODKJENNE ||
        sak.data.steg === StegType.FERDIG_BEHANDLET ||
        sak.data.steg === StegType.REVURDERE
      ) {
        setValgtTab(StegType.INNHENTE_FAKTA)
      } else {
        setValgtTab(sak?.data.steg)
      }
    }
  }, [])

  if (sak?.data.sakstype !== Oppgavetype.BARNEBRILLER) {
    throw new Error(
      `Feil ved visning av sak. Forventer at sak skal være av type BARNEBRILLER, men var ${sak?.data.sakstype} `
    )
  }

  if (!sak) return <div>Fant ikke saken</div>

  return (
    <Tabs defaultValue={StegType.INNHENTE_FAKTA.toString()} value={valgtTab} loop onChange={setValgtTab}>
      <FlexWrapper>
        <Tabs.List>
          <Tabs.Tab value={StegType.INNHENTE_FAKTA.toString()} label="1. Registrer søknad" />
          <Tabs.Tab value={StegType.VURDERE_VILKÅR.toString()} label="2. Vilkår" />
          <Tabs.Tab value={StegType.FATTE_VEDTAK.toString()} label="3. Vedtak" />
        </Tabs.List>
        <Border>
          <StatusTag sakStatus={sak.data.status} vedtakStatus={sak.data.vedtak?.status} />
          <MenyKnapp
            sakID={sak.data.sakId}
            tildeletSaksbehander={sak.data.saksbehandler}
            status={sak.data.status}
            kanTildeles={sak.kanTildeles}
            onMutate={mutate}
            knappeTekst="Meny"
            knappeIkon={<ChevronDownIcon />}
          />
        </Border>
      </FlexWrapper>

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

const FlexWrapper = styled.div`
  display: flex;
  margin-left: 'auto';
`

const Border = styled.div`
  display: flex;
  box-shadow: inset 0 -1px 0 0 var(--ac-tabs-border, var(--a-border-divider));
  padding-right: 2rem;
`

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr ${brilleSidebarBredde};
`

export default BarnebrilleBilde

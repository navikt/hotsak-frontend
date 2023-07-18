import React, { useEffect } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Tabs, Tag } from '@navikt/ds-react'

import { MenyKnapp } from '../../oppgaveliste/kolonner/MenyKnapp'

import { brilleSidebarBredde } from '../../GlobalStyles'
import { AlertError } from '../../feilsider/AlertError'
import {
  OppgaveStatusLabel,
  OppgaveStatusType,
  Oppgavetype,
  StegType,
  VedtakStatusType,
} from '../../types/types.internal'
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
          <TagWrapper>
            <Tag size="small" variant={tagVariant(sak.data.status, sak.data?.vedtak?.status)}>
              {OppgaveStatusLabel.get(sak.data.status)}
            </Tag>
          </TagWrapper>
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

const tagVariant = (status: OppgaveStatusType, vedtakStatus?: VedtakStatusType) => {
  switch (status) {
    case OppgaveStatusType.AVVENTER_DOKUMENTASJON:
      return 'warning'
    case OppgaveStatusType.VEDTAK_FATTET:
      if (vedtakStatus && vedtakStatus === VedtakStatusType.INNVILGET) return 'success'
      if (vedtakStatus && vedtakStatus === VedtakStatusType.AVSLÅTT) return 'error'
      break
    case OppgaveStatusType.AVVIST:
    case OppgaveStatusType.RETURNERT:
      return 'error'
    default:
      return 'info'
  }
}

const TagWrapper = styled.div`
  white-space: nowrap;
  margin: auto;
`

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

import { Alert, HGrid, HStack, Spacer } from '@navikt/ds-react'
import { memo, Suspense } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { AlertError } from '../../feilsider/AlertError'
import { AlertContainerMedium } from '../../felleskomponenter/AlertContainer'
import { hotsakBarnebrilleHistorikkMaxWidth, hotsakHistorikkMinWidth, søknadslinjeHøyde } from '../../GlobalStyles'
import { OppgavePåVentTag } from '../../oppgave/OppgavePåVentTag.tsx'
import { useOppgave } from '../../oppgave/useOppgave.ts'
import { useSaksbehandlerHarSkrivetilgang } from '../../tilgang/useSaksbehandlerHarSkrivetilgang.ts'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { OppgaveStatusType, Sakstype, StepType } from '../../types/types.internal'
import { StatusTag } from '../komponenter/StatusTag'
import { LasterPersonlinje } from '../Personlinje'
import { SaksbildeMenu } from '../SaksbildeMenu.tsx'
import { useBarnebrillesak } from '../useBarnebrillesak'
import { BarnebrillesakSidebar } from './BarnebrillesakSidebar'
import { ManuellSaksbehandlingProvider, useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import { RegistrerSøknad } from './steg/søknadsregistrering/RegistrerSøknad'
import { Vedtak } from './steg/vedtak/Vedtak'
import { VurderVilkår } from './steg/vilkårsvurdering/VurderVilkår'
import { Hotstepper } from './stegindikator/Hotstepper'

const BarnebrillesakContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 96vh;
`

const Header = styled(HStack)`
  box-shadow: inset 0 -1px 0 0 var(--ac-tabs-border, var(--ax-border-neutral-subtle));
  padding-right: 2rem;
  height: ${søknadslinjeHøyde};
  align-items: center;
`

const BarnebrillesakContent = memo(() => {
  const { oppgave, error: oppgaveError } = useOppgave()
  const { sak, error: sakError } = useBarnebrillesak()
  const { step } = useManuellSaksbehandlingContext()
  const harSkrivetilgang = useSaksbehandlerHarSkrivetilgang(sak?.tilganger)
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak()
  const { showBoundary } = useErrorBoundary()

  if (oppgaveError) {
    showBoundary(oppgaveError)
  }
  if (sakError) {
    showBoundary(sakError)
  }

  if (sak?.data.sakstype !== Sakstype.BARNEBRILLER) {
    throw new Error(
      `Feil ved visning av sak. Forventer at sak skal være av type BARNEBRILLER, men var ${sak?.data.sakstype}`
    )
  }

  if (!sak) return null

  const { saksstatus, vedtak } = sak.data
  const visStatusTag = !oppgave?.isPåVent || saksstatus === OppgaveStatusType.AVVENTER_DOKUMENTASJON
  return (
    <div>
      <Header wrap={false} align="baseline">
        <Hotstepper steg={sak.data.steg} lesemodus={!saksbehandlerKanRedigereBarnebrillesak} />
        <Spacer />
        <HStack justify="center" align="center" gap="space-16">
          {visStatusTag && <StatusTag saksstatus={saksstatus} vedtaksstatus={vedtak?.vedtaksstatus} />}
          {oppgave && <OppgavePåVentTag oppgave={oppgave} variant="outline" />}
          {harSkrivetilgang && <SaksbildeMenu spørreundersøkelseId="barnebrillesak_overført_gosys_v1" />}
        </HStack>
      </Header>
      {saksstatus === OppgaveStatusType.AVVENTER_DOKUMENTASJON && (
        <AlertContainerMedium>
          <Alert variant="info" size="small">
            Saken avventer opplysninger, og er satt på vent. Fortsett behandlingen av saken via menyen til høyre.
          </Alert>
        </AlertContainerMedium>
      )}
      <Steg aktivtSteg={step} />
    </div>
  )
})

function Steg({ aktivtSteg }: { aktivtSteg: StepType }) {
  switch (aktivtSteg) {
    case StepType.REGISTRER:
      return <RegistrerSøknad />
    case StepType.VILKÅR:
      return <VurderVilkår />
    case StepType.FATTE_VEDTAK:
      return <Vedtak />
  }
}

function LasterBarnebrillesaksbilde() {
  return (
    <BarnebrillesakContainer>
      <LasterPersonlinje />
    </BarnebrillesakContainer>
  )
}

export function Barnebrillesaksbilde() {
  return (
    <ErrorBoundary FallbackComponent={AlertError}>
      <Suspense fallback={<LasterBarnebrillesaksbilde />}>
        <ManuellSaksbehandlingProvider>
          <HGrid
            columns={`auto minmax(${hotsakHistorikkMinWidth}, ${hotsakBarnebrilleHistorikkMaxWidth})`}
            style={{ paddingBottom: 'var(--ax-space-12)' }}
          >
            <BarnebrillesakContent />
            <BarnebrillesakSidebar />
          </HGrid>
        </ManuellSaksbehandlingProvider>
      </Suspense>
    </ErrorBoundary>
  )
}

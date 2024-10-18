import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Alert, HGrid, HStack, Spacer } from '@navikt/ds-react'

import { MenyKnapp } from '../../oppgaveliste/kolonner/MenyKnapp'
import { brilleSidebarBredde } from '../../GlobalStyles'
import { AlertError } from '../../feilsider/AlertError'
import { AlertContainerMedium } from '../../felleskomponenter/AlertContainer'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { OppgaveStatusType, Sakstype, StepType } from '../../types/types.internal'
import { LasterPersonlinje } from '../Personlinje'
import { StatusTag } from '../komponenter/StatusTag'
import { useBarnebrillesak } from '../useBarnebrillesak'
import { BarnebrillesakSidebar } from './BarnebrillesakSidebar'
import { ManuellSaksbehandlingProvider, useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import { RegistrerSøknad } from './steg/søknadsregistrering/RegistrerSøknad'
import { Vedtak } from './steg/vedtak/Vedtak'
import { VurderVilkår } from './steg/vilkårsvurdering/VurderVilkår'
import { Hotstepper } from './stegindikator/Hotstepper'
import { memo, Suspense, useState } from 'react'
import { TildelingKonfliktModal } from '../TildelingKonfliktModal.tsx'

const BarnebrillesakContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`

const Header = styled(HStack)`
  box-shadow: inset 0 -1px 0 0 var(--ac-tabs-border, var(--a-border-divider));
  padding-right: 2rem;
  padding-bottom: 0.5em;
  padding-top: 0.5rem;
`

const BarnebrillesakContent = memo(() => {
  const { sak, isError, mutate } = useBarnebrillesak()
  const { step } = useManuellSaksbehandlingContext()
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak?.data)
  const { showBoundary } = useErrorBoundary()
  const [visTildelingKonfliktModalForSak, setVisTildelingKonfliktModalForSak] = useState<string | undefined>(undefined)

  if (isError) {
    showBoundary(isError)
  }

  if (sak?.data.sakstype !== Sakstype.BARNEBRILLER) {
    throw new Error(
      `Feil ved visning av sak. Forventer at sak skal være av type BARNEBRILLER, men var ${sak?.data.sakstype}`
    )
  }

  if (!sak) return <div>Fant ikke saken</div>

  return (
    <div>
      <Header wrap={false} align={'end'}>
        <Hotstepper steg={sak.data.steg} lesemodus={!saksbehandlerKanRedigereBarnebrillesak} />
        <Spacer />
        <HStack align="center">
          <StatusTag sakStatus={sak.data.status} vedtakStatus={sak.data.vedtak?.status} />
          <MenyKnapp
            sakId={sak.data.sakId}
            tildeltSaksbehandler={sak.data.saksbehandler}
            status={sak.data.status}
            kanTildeles={sak.kanTildeles}
            setKonfliktModalOpen={setVisTildelingKonfliktModalForSak}
            onMutate={mutate}
            knappeTekst="Meny"
            knappeIkon={<ChevronDownIcon />}
          />
          <TildelingKonfliktModal
            open={!!visTildelingKonfliktModalForSak}
            onClose={() => setVisTildelingKonfliktModalForSak(undefined)}
            saksbehandler={sak.data.saksbehandler}
          />
        </HStack>
      </Header>
      {sak.data.status === OppgaveStatusType.AVVENTER_DOKUMENTASJON && (
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
          <HGrid columns={`auto ${brilleSidebarBredde} `}>
            <BarnebrillesakContent />
            <BarnebrillesakSidebar />
          </HGrid>
        </ManuellSaksbehandlingProvider>
      </Suspense>
    </ErrorBoundary>
  )
}

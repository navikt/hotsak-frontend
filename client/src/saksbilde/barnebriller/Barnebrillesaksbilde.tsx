import { Alert, HGrid, HStack, Spacer } from '@navikt/ds-react'
import { memo } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { AlertContainerMedium } from '../../felleskomponenter/AlertContainer'
import { AsyncBoundary } from '../../felleskomponenter/AsyncBoundary.tsx'
import { hotsakBarnebrilleHistorikkMaxWidth, hotsakHistorikkMinWidth } from '../../GlobalStyles'
import { OppgavePåVentTag } from '../../oppgave/OppgavePåVentTag.tsx'
import { type Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes.ts'
import { useSaksbehandlerHarSkrivetilgang } from '../../tilgang/useSaksbehandlerHarSkrivetilgang.ts'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { OppgaveStatusType, Sakstype, StepType } from '../../types/types.internal'
import { StatusTag } from '../komponenter/StatusTag'
import { LasterPersonlinje } from '../Personlinje'
import { SaksbildeMenu } from '../SaksbildeMenu.tsx'
import { useBarnebrillesak } from '../useBarnebrillesak'
import classes from './Barnebrillesaksbilde.module.css'
import { BarnebrillesakSidebar } from './BarnebrillesakSidebar'
import { ManuellSaksbehandlingProvider, useManuellSaksbehandlingContext } from './ManuellSaksbehandlingTabContext'
import { RegistrerSøknad } from './steg/søknadsregistrering/RegistrerSøknad'
import { Vedtak } from './steg/vedtak/Vedtak'
import { VurderVilkår } from './steg/vilkårsvurdering/VurderVilkår'
import { Hotstepper } from './stegindikator/Hotstepper'

const BarnebrillesakContent = memo(({ oppgave }: { oppgave?: Saksbehandlingsoppgave }) => {
  const { sak, error: sakError } = useBarnebrillesak()
  const { step } = useManuellSaksbehandlingContext()
  const harSkrivetilgang = useSaksbehandlerHarSkrivetilgang(sak?.tilganger)
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak()
  const { showBoundary } = useErrorBoundary()

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
      <HStack className={classes.header} wrap={false} align="baseline">
        <Hotstepper steg={sak.data.steg} lesemodus={!saksbehandlerKanRedigereBarnebrillesak} />
        <Spacer />
        <HStack justify="center" align="center" gap="space-16">
          {visStatusTag && <StatusTag saksstatus={saksstatus} vedtaksstatus={vedtak?.vedtaksstatus} />}
          {oppgave && <OppgavePåVentTag oppgave={oppgave} variant="outline" />}
          {harSkrivetilgang && <SaksbildeMenu spørreundersøkelseId="barnebrillesak_overført_gosys_v1" />}
        </HStack>
      </HStack>
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
    <div className={classes.barnebrillesakContainer}>
      <LasterPersonlinje />
    </div>
  )
}

export default function Barnebrillesaksbilde({ oppgave }: { oppgave?: Saksbehandlingsoppgave }) {
  return (
    <AsyncBoundary suspenseFallback={<LasterBarnebrillesaksbilde />}>
      <ManuellSaksbehandlingProvider>
        <HGrid
          columns={`auto minmax(${hotsakHistorikkMinWidth}, ${hotsakBarnebrilleHistorikkMaxWidth})`}
          style={{ paddingBottom: 'var(--ax-space-12)' }}
        >
          <BarnebrillesakContent oppgave={oppgave} />
          <BarnebrillesakSidebar oppgave={oppgave} />
        </HGrid>
      </ManuellSaksbehandlingProvider>
    </AsyncBoundary>
  )
}

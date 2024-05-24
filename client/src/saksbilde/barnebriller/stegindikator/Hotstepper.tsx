import { useEffect } from 'react'
import styled from 'styled-components'

import { Box } from '@navikt/ds-react'

import { StegType, StepType } from '../../../types/types.internal'
import { useManuellSaksbehandlingContext } from '../ManuellSaksbehandlingTabContext'
import { Stepper } from '../stepper'

export function Hotstepper({ steg, lesemodus }: { steg: StegType; lesemodus: boolean }) {
  const { step, setStep } = useManuellSaksbehandlingContext()

  useEffect(() => {
    setStep(stegToStep(steg))
  }, [])

  const stegToStep = (steg: StegType) => {
    switch (steg) {
      case StegType.VURDERE_VILKÅR:
        return StepType.VILKÅR
      case StegType.FATTE_VEDTAK:
        return StepType.FATTE_VEDTAK
      case StegType.INNHENTE_FAKTA:
      default:
        return StepType.REGISTRER
    }
  }

  return (
    <StepperContainer>
      <Stepper
        aria-labelledby="stepper-heading"
        activeStep={step}
        interactive={lesemodus}
        onStepChange={(x) => setStep(x)}
        orientation="horizontal"
      >
        <Stepper.Step as="button">Registrer</Stepper.Step>
        <Stepper.Step as="button" interactive={lesemodus && steg !== StegType.INNHENTE_FAKTA}>
          Vilkår
        </Stepper.Step>
        <Stepper.Step
          as="button"
          interactive={lesemodus && steg !== StegType.INNHENTE_FAKTA && steg !== StegType.VURDERE_VILKÅR}
        >
          Vedtak
        </Stepper.Step>
      </Stepper>
    </StepperContainer>
  )
}

const StepperContainer = styled(Box)`
  width: 400px;
`

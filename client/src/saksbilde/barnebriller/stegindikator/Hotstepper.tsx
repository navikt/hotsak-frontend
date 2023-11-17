import { Box, Stepper } from '@navikt/ds-react'
import { useEffect } from 'react'
import styled from 'styled-components'
import { StegType, StepType } from '../../../types/types.internal'
import { useManuellSaksbehandlingContext } from '../ManuellSaksbehandlingTabContext'

const StepperContainer = styled(Box)`
  width: 350px;
`

export const Hotstepper: React.FC<{ steg: StegType }> = ({ steg }) => {
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
        onStepChange={(x) => setStep(x)}
        orientation="horizontal"
      >
        <Stepper.Step as="button">Registrer</Stepper.Step>
        <Stepper.Step as="button" interactive={steg !== StegType.INNHENTE_FAKTA}>
          Vilkår
        </Stepper.Step>
        <Stepper.Step as="button" interactive={steg !== StegType.INNHENTE_FAKTA && steg !== StegType.VURDERE_VILKÅR}>
          Vedtak
        </Stepper.Step>
      </Stepper>
    </StepperContainer>
  )
}

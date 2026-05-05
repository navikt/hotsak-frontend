import { useEffect } from 'react'

import classes from './Hotstepper.module.css'

import { StegType, StepType } from '../../../types/types.internal'
import { useManuellSaksbehandlingContext } from '../ManuellSaksbehandlingTabContext'
import { Stepper } from '../stepper'

export function Hotstepper({ steg, lesemodus }: { steg: StegType; lesemodus: boolean }) {
  const { step, setStep } = useManuellSaksbehandlingContext()
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

  useEffect(() => {
    setStep(stegToStep(steg))
  }, [steg, setStep])

  return (
    <div className={classes.stepperContainer}>
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
    </div>
  )
}

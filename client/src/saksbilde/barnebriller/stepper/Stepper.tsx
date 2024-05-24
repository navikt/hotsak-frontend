import cl from 'clsx'
import {
  Children,
  cloneElement,
  forwardRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  isValidElement,
  ReactNode,
  RefAttributes,
} from 'react'

import { Step, StepperStepProps } from './Step'
import { StepperContext } from './context'
import './hotstepper.css'

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  /**
   * <Stepper.Step /> elements
   */
  children: ReactNode
  /**
   * The direction the component grows.
   * @default "vertical"
   */
  orientation?: 'horizontal' | 'vertical'
  /**
   * Current active step.
   * @note Stepper index starts at 1, not 0
   */
  activeStep: number
  /**
   * Callback for next activeStep
   * @note Stepper index starts at 1, not 0
   */
  onStepChange?: (step: number) => void
  /**
   * Makes stepper non-interactive if false
   * @default true
   */
  interactive?: boolean
}

interface StepperComponent extends ForwardRefExoticComponent<StepperProps & RefAttributes<HTMLOListElement>> {
  /**
   * @see 🏷️ {@link StepperStepProps}
   * @see [🤖 OverridableComponent](https://aksel.nav.no/grunnleggende/kode/overridablecomponent) support
   */
  Step: typeof Step
}

/**
 * A component that displays a stepper with clickable steps.
 *
 * @see [📝 Documentation](https://aksel.nav.no/komponenter/core/stepper)
 * @see 🏷️ {@link StepperProps}
 *
 * @example
 * ```jsx
 * <>
 *   <Heading size="medium" spacing level="2" id="stepper-heading">
 *     Søknadssteg
 *   </Heading>
 *   <Stepper
 *     aria-labelledby="stepper-heading"
 *     activeStep={activeStep}
 *     onStepChange={(x) => setActiveStep(x)}
 *   >
 *     <Stepper.Step href="#">Start søknad</Stepper.Step>
 *     <Stepper.Step href="#">Saksopplysninger</Stepper.Step>
 *     <Stepper.Step href="#">Vedlegg</Stepper.Step>
 *   </Stepper>
 * </>
 * ```
 */
export const Stepper: StepperComponent = forwardRef<HTMLOListElement, StepperProps>(
  (
    { children, className, activeStep, orientation = 'vertical', onStepChange = () => {}, interactive = true, ...rest },
    ref
  ) => {
    activeStep = activeStep - 1
    return (
      <ol
        {...rest}
        ref={ref}
        className={cl('hot-stepper', orientation === 'horizontal' ? 'hot-stepper--horizontal' : '', className)}
      >
        <StepperContext.Provider
          value={{
            activeStep,
            onStepChange,
            lastIndex: Children.count(children),
            orientation,
            interactive,
          }}
        >
          {Children.map(children, (step, index) => {
            return (
              <li
                className={cl('hot-stepper__item', {
                  'hot-stepper__item--behind': activeStep > index,
                  // 'hot-stepper__item--completed': isValidElement<StepperStepProps>(step) && step?.props?.completed,
                  'hot-stepper__item--non-interactive':
                    isValidElement<StepperStepProps>(step) && !(step?.props?.interactive ?? interactive),
                })}
                key={index + (children?.toString?.() ?? '')}
              >
                <span className="hot-stepper__line hot-stepper__line--1" />
                {isValidElement<StepperStepProps>(step)
                  ? cloneElement(step, {
                      ...step.props,
                      unsafe_index: index,
                    })
                  : step}
                <span className="hot-stepper__line hot-stepper__line--2" />
              </li>
            )
          })}
        </StepperContext.Provider>
      </ol>
    )
  }
) as StepperComponent

Stepper.Step = Step

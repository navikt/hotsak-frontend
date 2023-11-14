import 'date-fns'
import React from 'react'
import { useFormContext } from 'react-hook-form'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Tekstfelt } from '../../../../felleskomponenter/skjema/Tekstfelt'
import { useBrillesak } from '../../../sakHook'
import { Utbetalingsmottaker } from './Utbetalingsmottaker'
import { Bestillingsdato } from './skjemaelementer/Bestillingsdato'
import { BestiltHosOptiker } from './skjemaelementer/BestiltHosOptiker'
import { BrillestyrkeForm } from './skjemaelementer/BrillestyrkeForm'
import { KomplettBrille } from './skjemaelementer/KomplettBrille'
import { validator, validering } from './skjemaelementer/validering/validering'

export const RegistrerBrillegrunnlag: React.FC = () => {
  const { sak } = useBrillesak()
  const {
    register,
    formState: { errors },
  } = useFormContext<{ brillepris: string }>()

  return (
    <Avstand paddingLeft={2} paddingRight={2}>
      <Avstand paddingTop={6}>
        <Utbetalingsmottaker defaultInnsenderFnr={sak?.data.utbetalingsmottaker?.fnr} />
      </Avstand>
      <Avstand paddingTop={4}>
        <Bestillingsdato />
      </Avstand>
      <Avstand paddingTop={4}>
        <Tekstfelt
          id="brillepris"
          label="Pris på brillen"
          description="Skal bare inkludere glass, slip av glass og innfatning, inkl moms, og brilletilpasning. Eventuell synsundersøkelse skal ikke inkluderes i prisen."
          error={errors?.brillepris?.message}
          size="small"
          {...register('brillepris', {
            //required: 'Du må oppgi en brillepris',
            validate: validator(validering.beløp, 'Ugyldig brillepris'),
          })}
        />
      </Avstand>
      <BrillestyrkeForm />
      <KomplettBrille />
      <BestiltHosOptiker />
    </Avstand>
  )
}

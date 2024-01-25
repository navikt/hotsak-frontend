import 'date-fns'
import React from 'react'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { useBrillesak } from '../../../sakHook'
import { Utbetalingsmottaker } from './Utbetalingsmottaker'
import { Bestillingsdato } from './skjemaelementer/Bestillingsdato'
import { BestiltHosOptiker } from './skjemaelementer/BestiltHosOptiker'
import { BrillestyrkeForm } from './skjemaelementer/BrillestyrkeForm'
import { KjøptBrille } from './skjemaelementer/KjøptBrille'
import { KomplettBrille } from './skjemaelementer/KomplettBrille'

export const RegistrerBrillegrunnlag: React.FC = () => {
  const { sak } = useBrillesak()

  return (
    <>
      <Avstand paddingTop={10}>
        <Utbetalingsmottaker defaultInnsenderFnr={sak?.data.utbetalingsmottaker?.fnr} />
      </Avstand>
      <BrillestyrkeForm />
      <Avstand paddingTop={10}>
        <Bestillingsdato />
      </Avstand>
      <KjøptBrille />
      <KomplettBrille />
      <BestiltHosOptiker />
    </>
  )
}

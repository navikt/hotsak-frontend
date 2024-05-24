import 'date-fns'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { Utbetalingsmottaker } from './Utbetalingsmottaker'
import { Bestillingsdato } from './skjemaelementer/Bestillingsdato'
import { BestiltHosOptiker } from './skjemaelementer/BestiltHosOptiker'
import { BrillestyrkeForm } from './skjemaelementer/BrillestyrkeForm'
import { KjøptBrille } from './skjemaelementer/KjøptBrille'
import { KomplettBrille } from './skjemaelementer/KomplettBrille'

export function RegistrerBrillegrunnlag() {
  const { sak } = useBarnebrillesak()

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

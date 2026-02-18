import 'date-fns'

import { VStack } from '@navikt/ds-react'
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
    <VStack gap="space-40" paddingBlock="space-40 space-0" marginInline="space-0 space-4">
      <Utbetalingsmottaker defaultInnsenderFnr={sak?.data.utbetalingsmottaker?.fnr} />
      <BrillestyrkeForm />
      <Bestillingsdato />
      <KjøptBrille />
      <KomplettBrille />
      <BestiltHosOptiker />
    </VStack>
  )
}

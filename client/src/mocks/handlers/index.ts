import type { StoreHandlersFactory } from '../data'

import { alternativprodukterHandlers } from './alternativprodukter.ts'
import { ansatteHandlers } from './ansatte.ts'
import { behovsmeldingHandlers } from './behovsmelding.ts'
import { bestillingHandlers } from './bestilling.ts'
import { bildeHandlers } from './bilder.ts'
import { brevHandlers } from './brev.ts'
import { brevutkastHandlers } from './brevutkast.ts'
import { brillekalkulatorHandlers } from './brillekalkulator.ts'
import { dokumentHandlers } from './dokumenter.ts'
import { endringsloggHandlers } from './endringslogg.ts'
import { grunndataHandlers } from './grunndata.ts'
import { hjelpemiddelHandlers } from './hjelpemiddel.ts'
import { hjelpemiddeloversiktHandlers } from './hjelpemiddeloversikt.ts'
import { notatHandlers } from './notat.ts'
import { oppgaveHandlers } from './oppgaver.ts'
import { personHandlers } from './person.ts'
import { saksbehandlingHandlers } from './saksbehandling.ts'
import { saksoversiktHandlers } from './saksoversikt.ts'
import { saksvarslerHandlers } from './saksvarsler.ts'
import { totrinnskontrollHandlers } from './totrinnskontroll.ts'
import { utbetalingsmottakerHandlers } from './utbetalingsmottaker.ts'
import { vilkårsvurderingHandlers } from './vilkårsvurdering.ts'

export const setupHotsakApiHandlers: StoreHandlersFactory = (store) => [
  ...ansatteHandlers(store),
  ...behovsmeldingHandlers(store),
  ...bestillingHandlers(store),
  ...bildeHandlers(),
  ...brevHandlers(store),
  ...brevutkastHandlers(store),
  ...brillekalkulatorHandlers(store),
  ...dokumentHandlers(store),
  ...endringsloggHandlers(store),
  ...hjelpemiddelHandlers(store),
  ...hjelpemiddeloversiktHandlers(store),
  ...notatHandlers(store),
  ...oppgaveHandlers(store),
  ...personHandlers(store),
  ...saksvarslerHandlers(store),
  ...saksbehandlingHandlers(store),
  ...saksoversiktHandlers(store),
  ...totrinnskontrollHandlers(store),
  ...utbetalingsmottakerHandlers(store),
  ...vilkårsvurderingHandlers(store),
]

export const setupGrunndataHandlers: StoreHandlersFactory = (store) => grunndataHandlers(store)
export const setupAlternativprodukterHandlers: StoreHandlersFactory = (store) => alternativprodukterHandlers(store)

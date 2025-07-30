import type { StoreHandlersFactory } from '../data'

import { brillekalkulatorHandlers } from './brillekalkulator.ts'
import { brevHandlers } from './brev.ts'
import { dokumentHandlers } from './dokumenter.ts'
import { endringsloggHandlers } from './endringslogg.ts'
import { grunndataHandler } from './grunndata.ts'
import { hjelpemiddelHandlers } from './hjelpemiddel.ts'
import { hjelpemiddeloversiktHandlers } from './hjelpemiddeloversikt.ts'
import { notatHandlers } from './notat.ts'
import { oppgaveHandlers } from './oppgaver.ts'
import { personHandlers } from './person.ts'
import { ansatteHandlers } from './ansatte.ts'
import { saksbehandlingHandlers } from './saksbehandling.ts'
import { saksoversiktHandlers } from './saksoversikt.ts'
import { totrinnskontrollHandlers } from './totrinnskontroll.ts'
import { utbetalingsmottakerHandlers } from './utbetalingsmottaker.ts'
import { vilkårsvurderingHandlers } from './vilkårsvurdering.ts'
import { bestillingHandlers } from './bestilling.ts'
import { brevutkastHandlers } from './brevutkast.ts'
import { saksvarslerHandlers } from './saksvarsler.ts'
import { behovsmeldingHandlers } from './behovsmelding.ts'
import { alternativprodukterHandlers } from './alternativprodukter.ts'
import { bildeHandlers } from './bilder.ts'

export const setupHandlers: StoreHandlersFactory = (store) => [
  ...(window.appSettings.USE_MSW_ALTERNATIVPRODUKTER ? alternativprodukterHandlers(store) : []),
  ...ansatteHandlers(store),
  ...behovsmeldingHandlers(store),
  ...bestillingHandlers(store),
  ...bildeHandlers(),
  ...brevHandlers(store),
  ...brevutkastHandlers(store),
  ...brillekalkulatorHandlers(store),
  ...dokumentHandlers(store),
  ...endringsloggHandlers(store),
  ...(window.appSettings.USE_MSW_GRUNNDATA ? grunndataHandler(store) : []),
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

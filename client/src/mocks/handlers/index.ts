import type { StoreHandlersFactory } from '../data'
import { brillekalkulatorHandlers } from './brillekalkulator'
import { brevHandlers } from './brev'
import { dokumentHandlers } from './dokumenter'
import { endringsloggHandlers } from './endringslogg'
import { finnHjelpemiddelHandlers } from './finnHjelpemiddel'
import { hjelpemiddelHandlers } from './hjelpemiddel'
import { hjelpemiddeloversiktHandlers } from './hjelpemiddeloversikt'
import { notatHandlers } from './notat'
import { oppgaveHandlers } from './oppgaver'
import { personHandlers } from './person'
import { saksbehandlerHandlers } from './saksbehandler'
import { saksbehandlingHandlers } from './saksbehandling'
import { saksoversiktHandlers } from './saksoversikt'
import { totrinnskontrollHandlers } from './totrinnskontroll'
import { utbetalingsmottakerHandlers } from './utbetalingsmottaker'
import { vilkårsvurderingHandlers } from './vilkårsvurdering'
import { bestillingHandlers } from './bestilling'
import { brevutkastHandlers } from './brevutkast'
import { saksVarslerHandlers } from './saksvarsler'

export const setupHandlers: StoreHandlersFactory = (store) => [
  ...bestillingHandlers(store),
  ...brevHandlers(store),
  ...brevutkastHandlers(store),
  ...brillekalkulatorHandlers(store),
  ...dokumentHandlers(store),
  ...endringsloggHandlers(store),
  ...finnHjelpemiddelHandlers(store),
  ...hjelpemiddelHandlers(store),
  ...hjelpemiddeloversiktHandlers(store),
  ...notatHandlers(store),
  ...oppgaveHandlers(store),
  ...personHandlers(store),
  ...saksbehandlerHandlers(store),
  ...saksbehandlingHandlers(store),
  ...saksVarslerHandlers(store),
  ...saksoversiktHandlers(store),
  ...totrinnskontrollHandlers(store),
  ...utbetalingsmottakerHandlers(store),
  ...vilkårsvurderingHandlers(store),
]

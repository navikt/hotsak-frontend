import type { StoreHandlersFactory } from '../data'
import { brillekalkulatorHandlers } from './beregnSats'
import { brevHandlers } from './brev'
import { dokumentHandlers } from './dokumenter'
import { endringsloggHandlers } from './endringslogg'
import { grunndataHandlers } from './grunndata'
import { hjelpemiddelHandlers } from './hjelpemiddel'
import { hjelpemiddeloversiktHandlers } from './hjelpemiddeloversikt'
import { personInfoHandlers } from './personoversikt'
import { saksbehandlerHandlers } from './saksbehandler'
import { saksbehandlingHandlers } from './saksbehandling'
import { saksoversiktHandlers } from './saksoversikt'
import { totrinnskontrollHandlers } from './totrinnskontroll'
import { utbetalingsmottakerHandlers } from './utbetalingsmottaker'
import { utviklingsverktøyHandlers } from './utviklingsverktøy'
import { vilkårsvurderingHandlers } from './vilkårsvurdering'

export const setupHandlers: StoreHandlersFactory = (store) => [
  ...brevHandlers(store),
  ...brillekalkulatorHandlers(),
  ...dokumentHandlers(store),
  ...endringsloggHandlers(store),
  ...grunndataHandlers(store),
  ...hjelpemiddelHandlers(store),
  ...hjelpemiddeloversiktHandlers(store),
  ...utbetalingsmottakerHandlers(store),
  ...personInfoHandlers(store),
  ...saksbehandlingHandlers(store),
  ...saksoversiktHandlers(store),
  ...saksbehandlerHandlers(store),
  ...totrinnskontrollHandlers(store),
  ...vilkårsvurderingHandlers(store),
  ...utviklingsverktøyHandlers(store),
]

import type { StoreHandlersFactory } from '../data'
import { brillekalkulatorHandlers } from './beregnSats'
import { brevHandlers } from './brev'
import { brevtekstHandlers } from './brevTekst'
import { dokumentHandlers } from './dokumenter'
import { endringsloggHandlers } from './endringslogg'
import { finnHjelpemiddelHandlers } from './finnHjelpemiddel'
import { hjelpemiddelHandlers } from './hjelpemiddel'
import { hjelpemiddeloversiktHandlers } from './hjelpemiddeloversikt'
import { notatHandlers } from './notat'
import { oppgaveHandlers } from './oppgaver'
import { personoversiktHandlers } from './personoversikt'
import { saksbehandlerHandlers } from './saksbehandler'
import { saksbehandlingHandlers } from './saksbehandling'
import { saksoversiktHandlers } from './saksoversikt'
import { totrinnskontrollHandlers } from './totrinnskontroll'
import { utbetalingsmottakerHandlers } from './utbetalingsmottaker'
import { vilkårsvurderingHandlers } from './vilkårsvurdering'

export const setupHandlers: StoreHandlersFactory = (store) => [
  ...brevHandlers(store),
  ...brevtekstHandlers(store),
  ...brillekalkulatorHandlers(store),
  ...dokumentHandlers(store),
  ...endringsloggHandlers(store),
  ...finnHjelpemiddelHandlers(store),
  ...hjelpemiddelHandlers(store),
  ...hjelpemiddeloversiktHandlers(store),
  ...notatHandlers(store),
  ...oppgaveHandlers(store),
  ...personoversiktHandlers(store),
  ...saksbehandlerHandlers(store),
  ...saksbehandlingHandlers(store),
  ...saksoversiktHandlers(store),
  ...totrinnskontrollHandlers(store),
  ...utbetalingsmottakerHandlers(store),
  ...vilkårsvurderingHandlers(store),
]

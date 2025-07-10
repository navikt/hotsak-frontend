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
import { ansatteHandlers } from './ansatte.ts'
import { saksbehandlingHandlers } from './saksbehandling'
import { saksoversiktHandlers } from './saksoversikt'
import { totrinnskontrollHandlers } from './totrinnskontroll'
import { utbetalingsmottakerHandlers } from './utbetalingsmottaker'
import { vilkårsvurderingHandlers } from './vilkårsvurdering'
import { bestillingHandlers } from './bestilling'
import { brevutkastHandlers } from './brevutkast'
import { saksVarslerHandlers } from './saksvarsler'
import { behovsmeldingHandlers } from './behovsmelding'
import { finnAlternativProduktHandlers } from './finnAlternativProdukt.ts'
import { bildeHandlers } from './bilder.ts'
import { utviklingHandlers } from './utvikling.ts'

export const setupHandlers: StoreHandlersFactory = (store) => [
  ...ansatteHandlers(store),
  ...behovsmeldingHandlers(store),
  ...bestillingHandlers(store),
  ...bildeHandlers(),
  ...brevHandlers(store),
  ...brevutkastHandlers(store),
  ...brillekalkulatorHandlers(store),
  ...dokumentHandlers(store),
  ...endringsloggHandlers(store),
  ...finnAlternativProduktHandlers(store),
  ...finnHjelpemiddelHandlers(store),
  ...hjelpemiddelHandlers(store),
  ...hjelpemiddeloversiktHandlers(store),
  ...notatHandlers(store),
  ...oppgaveHandlers(store),
  ...personHandlers(store),
  ...saksVarslerHandlers(store),
  ...saksbehandlingHandlers(store),
  ...saksoversiktHandlers(store),
  ...totrinnskontrollHandlers(store),
  ...utbetalingsmottakerHandlers(store),
  ...utviklingHandlers(store),
  ...vilkårsvurderingHandlers(store),
]

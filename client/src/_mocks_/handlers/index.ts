import brillekalkulatorHandlers from './beregnSats'
import brevHandlers from './brev'
import dokumentHandlers from './dokumenter'
import endringsloggHandlers from './endringslogg'
import grunndataHandlers from './grunndata'
import hjelpemiddelHandlers from './hjelpemiddel'
import hjelpemiddeloversiktHandlers from './hjelpemiddeloversikt'
import personInfoHandlers from './personoversikt'
import saksbehandlerHandlers from './saksbehandler'
import saksbehandlingHandlers from './saksbehandling'
import saksoversiktHandlers from './saksoversikt'
import totrinnsKontrollHandlers from './totrinnskontroll'
import utbetalingsmottakerHandlers from './utbetalingsmottaker'
import utviklingsverktøyHandlers from './utviklingsverktøy'
import vilkårsvurderingHandlers from './vilkårsvurdering'

const handlers = [
  ...brevHandlers,
  ...brillekalkulatorHandlers,
  ...dokumentHandlers,
  ...endringsloggHandlers,
  ...grunndataHandlers,
  ...hjelpemiddelHandlers,
  ...hjelpemiddeloversiktHandlers,
  ...utbetalingsmottakerHandlers,
  ...personInfoHandlers,
  ...saksbehandlingHandlers,
  ...saksoversiktHandlers,
  ...saksbehandlerHandlers,
  ...totrinnsKontrollHandlers,
  ...vilkårsvurderingHandlers,
  ...utviklingsverktøyHandlers,
]

export default handlers

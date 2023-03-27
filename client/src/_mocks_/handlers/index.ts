import brillekalkulatorHandlers from './beregnSats'
import brevHandlers from './brev'
import dokumentHandlers from './dokumenter'
import endringsloggHandlers from './endringslogg'
import grunndataHandlers from './grunndata'
import hjelpemiddelHandlers from './hjelpemiddel'
import hjelpemiddeloversiktHandlers from './hjelpemiddeloversikt'
import kontonummerHandlers from './kontonummer'
import personInfoHandlers from './personoversikt'
import saksbehandlingHandlers from './saksbehandling'
import saksoversiktHandlers from './saksoversikt'
import tilgangHandlers from './tilgang'
import totrinnsKontrollHandlers from './totrinnkontroll'

const handlers = [
  ...brevHandlers,
  ...brillekalkulatorHandlers,
  ...dokumentHandlers,
  ...endringsloggHandlers,
  ...grunndataHandlers,
  ...hjelpemiddelHandlers,
  ...hjelpemiddeloversiktHandlers,
  ...kontonummerHandlers,
  ...personInfoHandlers,
  ...saksbehandlingHandlers,
  ...saksoversiktHandlers,
  ...tilgangHandlers,
  ...totrinnsKontrollHandlers,
]

export default handlers

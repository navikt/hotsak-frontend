import brillekalkulatorHandlers from './beregnSats'
import dokumentHandlers from './dokumenter'
import endringsloggHandlers from './endringslogg'
import grunndataHandlers from './grunndata'
import hjelpemiddelHandlers from './hjelpemiddel'
import hjelpemiddeloversiktHandlers from './hjelpemiddeloversikt'
import kontonummerHandlers from './kontonummer'
import personInfoHandlers from './personoversikt'
import saksbehandlingHandlers from './saksbehandling'
import saksoversiktHandlers from './saksoversikt'

const handlers = [
  ...saksbehandlingHandlers,
  ...grunndataHandlers,
  ...hjelpemiddeloversiktHandlers,
  ...saksoversiktHandlers,
  ...endringsloggHandlers,
  ...personInfoHandlers,
  ...hjelpemiddelHandlers,
  ...dokumentHandlers,
  ...brillekalkulatorHandlers,
  ...kontonummerHandlers,
]

export default handlers

import bestillingsordningsHandlers from './bestillingsordning'
import endringsloggHandlers from './endringslogg'
import grunndataHandlers from './grunndata'
import hjelpemiddeloversiktHandlers from './hjelpemiddeloversikt'
import personInfoHandlers from './personoversikt'
import saksbehandlingHandlers from './saksbehandling'
import saksoversiktHandlers from './saksoversikt'

const handlers = [
  ...saksbehandlingHandlers,
  ...bestillingsordningsHandlers,
  ...grunndataHandlers,
  ...hjelpemiddeloversiktHandlers,
  ...saksoversiktHandlers,
  ...endringsloggHandlers,
  ...personInfoHandlers,
]

export default handlers

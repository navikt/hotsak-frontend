import grunndataHandlers from './grunndata'
import saksbehandlingHandlers from './saksbehandling'
import hjelpemiddeloversiktHandlers from './hjelpemiddeloversikt'
import saksoversiktHandlers from './saksoversikt'
import endringsloggHandlers from './endringslogg'

const handlers = [
  ...saksbehandlingHandlers,
  ...grunndataHandlers,
  ...hjelpemiddeloversiktHandlers,
  ...saksoversiktHandlers,
  ...endringsloggHandlers,
]

export default handlers

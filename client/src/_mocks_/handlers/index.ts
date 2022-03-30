import grunndataHandlers from './grunndata'
import saksbehandlingHandlers from './saksbehandling'
import hjelpemiddeloversiktHandlers from './hjelpemiddeloversikt'
import saksoversiktHandlers from './saksoversikt'
import endringsloggHandlers from './endringslogg'
import personInfoHandlers from './personoversikt'

const handlers = [
  ...saksbehandlingHandlers,
  ...grunndataHandlers,
  ...hjelpemiddeloversiktHandlers,
  ...saksoversiktHandlers,
  ...endringsloggHandlers,
  ...personInfoHandlers

]

export default handlers

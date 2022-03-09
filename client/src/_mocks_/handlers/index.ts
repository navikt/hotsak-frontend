import grunndataHandlers from './grunndata'
import saksbehandlingHandlers from './saksbehandling'
import hjelpemiddeloversiktHandlers from './hjelpemiddeloversikt'
import saksoversiktHandlers from './saksoversikt'

const handlers = [...saksbehandlingHandlers, ...grunndataHandlers, ...hjelpemiddeloversiktHandlers, ...saksoversiktHandlers]

export default handlers

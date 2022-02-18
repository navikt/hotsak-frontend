import grunndataHandlers from './grunndata'
import saksbehandlingHandlers from './saksbehandling'
import hjelpemiddeloversiktHandlers from './hjelpemiddeloversikt'

const handlers = [...saksbehandlingHandlers, ...grunndataHandlers, ...hjelpemiddeloversiktHandlers]

export default handlers

import saksbehandlingHandlers from './saksbehandling'
import saksbildeHandlers from './saksbilde'

const handlers = [...saksbehandlingHandlers, ...saksbildeHandlers]

export default handlers

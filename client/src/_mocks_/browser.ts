import { setupWorker } from 'msw'
import { rest } from 'msw'

import handlers from './handlers/index'

// for browser environments
export const worker = setupWorker(...handlers)
console.log('worker', worker)

worker.printHandlers()

// Make it accessible for cypress
window.msw = {
  worker,
  rest,
}

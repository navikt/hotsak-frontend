import { http } from 'msw'

import { lastTilfeldigProduktbilde } from '../data/felles'
import { respondImage } from './response'

export const bildeHandlers = () => [
  http.get(`/imageproxy/:rest*`, async () => {
    console.log('Fetching random product image...')

    let buffer: ArrayBuffer

    buffer = await lastTilfeldigProduktbilde()
    return respondImage(buffer)
  }),
]

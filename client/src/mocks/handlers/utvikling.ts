import { http } from 'msw'

import type { StoreHandlersFactory } from '../data'

export const utviklingHandlers: StoreHandlersFactory = () => [
  http.post('/log', async ({ request }) => {
    console.log(await request.json())
    return new Response(null, { status: 202 })
  }),
]

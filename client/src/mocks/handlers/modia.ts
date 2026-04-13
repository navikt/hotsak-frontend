import { http, HttpResponse } from 'msw'

export const modiaHandlers = () => [
  http.post('/modiacontextholder-api/api/context', () => {
    return new HttpResponse(null, { status: 200 })
  }),
]

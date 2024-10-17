import { HttpResponse } from 'msw'

export function respondCreated(location?: string): Response {
  return new Response(null, {
    status: 201,
    headers: {
      Location: location || '', // fixme
    },
  })
}

export function respondNoContent(): Response {
  return new Response(null, { status: 204 })
}

export function respondUnauthorized(): Response {
  return new Response(null, { status: 401 })
}

export function respondForbidden(): Response {
  return new Response(null, { status: 403 })
}

export function respondNotFound(): Response {
  return new Response(null, { status: 404 })
}

export function respondConflict(): Response {
  return new Response(null, { status: 409 })
}

export function respondInternalServerError(): Response {
  return new Response(null, { status: 500 })
}

export function respondPdf(buffer: ArrayBuffer): Response {
  return HttpResponse.arrayBuffer(buffer, {
    headers: {
      'Content-Length': buffer.byteLength.toString(),
      'Content-Type': 'application/pdf',
    },
    status: 200,
  })
}

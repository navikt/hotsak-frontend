/**
 * @deprecated 200 skal ha response body
 */
export function respondOK(): Response {
  return new Response(null, { status: 200 })
}

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

export function respondInternalServerError(): Response {
  return new Response(null, { status: 500 })
}

export function respondPdf(buffer: ArrayBuffer): Response {
  return new Response(buffer, {
    headers: {
      'Content-Length': buffer.byteLength.toString(),
      'Content-Type': 'application/pdf',
    },
  })
}

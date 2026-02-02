import { delay as mswDelay, DelayMode, HttpResponse } from 'msw'

export function getUrlParam<T>(url: URL, name: string): T | undefined {
  return (url.searchParams.get(name) ?? undefined) as T | undefined
}

export function getUrlParams<T>(url: URL, name: string): T[] | undefined {
  return (url.searchParams.getAll(name) ?? undefined) as T[] | undefined
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

export function respondBadRequest(): Response {
  return new Response(null, { status: 400 })
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

export function respondImage(buffer: ArrayBuffer): Response {
  return HttpResponse.arrayBuffer(buffer, { headers: { 'Content-Type': 'image/png' }, status: 200 })
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

export function delay(durationOrMode?: DelayMode | number): Promise<void> {
  if (DELAY_ENABLED) {
    return mswDelay(durationOrMode)
  } else {
    return mswDelay(0)
  }
}

const DELAY_ENABLED: boolean = false

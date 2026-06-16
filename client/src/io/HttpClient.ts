import { useEffect, useMemo } from 'react'
import { toWeakETag } from './etag.ts'
import { HttpError } from './HttpError.ts'
import { contentTypeIsJson, contentTypeIsPdf, contentTypeIsText } from './response.ts'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const validHttpAcceptValues = ['application/json', 'application/pdf'] as const

export type HttpAccept = (typeof validHttpAcceptValues)[number]

export type HttpAcceptKey = [string, HttpAccept]

export interface RequestOptions {
  accept?: HttpAccept
  versjon?: string | number
}

async function request<ResponseBody = unknown>(
  method: HttpMethod,
  url: string,
  body?: unknown,
  options: RequestOptions = {}
): Promise<ResponseBody> {
  const { accept: Accept = 'application/json', versjon } = options
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept,
        ...(body == null ? {} : { 'Content-Type': 'application/json' }),
        ...(versjon == null ? {} : { 'If-Match': toWeakETag(versjon) }),
        'X-Requested-With': 'XMLHttpRequest',
      },
      ...(body == null ? {} : { body: JSON.stringify(body) }),
    })
    if (response.ok) {
      if (contentTypeIsJson(response)) {
        return (await response.json()) as ResponseBody
      }
      if (contentTypeIsPdf(response)) {
        return (await response.blob()) as ResponseBody
      }
      if (contentTypeIsText(response)) {
        return (await response.text()) as ResponseBody
      }
      return undefined as ResponseBody
    }
    return HttpError.reject(url, response)
  } catch (err: unknown) {
    throw HttpError.wrap(err)
  }
}

export interface HttpClient {
  get<ResponseBody = unknown>(urlOrKey: string | HttpAcceptKey, options?: RequestOptions): Promise<ResponseBody>
  post<RequestBody = unknown, ResponseBody = unknown>(
    url: string,
    body?: RequestBody,
    options?: RequestOptions
  ): Promise<ResponseBody>
  put<RequestBody = unknown, ResponseBody = unknown>(
    url: string,
    body?: RequestBody,
    options?: RequestOptions
  ): Promise<ResponseBody>
  delete(url: string, options?: RequestOptions): Promise<void>
}

export const http: HttpClient = {
  get<ResponseBody = unknown>(urlOrKey: string | HttpAcceptKey, options?: RequestOptions): Promise<ResponseBody> {
    if (typeof urlOrKey === 'string') {
      return request('GET', urlOrKey, undefined, options)
    }
    if (Array.isArray(urlOrKey) && urlOrKey.length > 1) {
      const [url, accept] = urlOrKey
      if (validHttpAcceptValues.includes(accept)) {
        return request('GET', url, undefined, { ...options, accept })
      }
    }
    throw new Error(`Invalid key: '${JSON.stringify(urlOrKey)}'`)
  },
  post<RequestBody = unknown, ResponseBody = unknown>(
    url: string,
    body?: RequestBody,
    options?: RequestOptions
  ): Promise<ResponseBody> {
    return request('POST', url, body, options)
  },
  put<RequestBody = unknown, ResponseBody = unknown>(
    url: string,
    body?: RequestBody,
    options?: RequestOptions
  ): Promise<ResponseBody> {
    return request('PUT', url, body, options)
  },
  delete(url: string, options?: RequestOptions): Promise<void> {
    return request('DELETE', url, undefined, options)
  },
}

export function getMultiple<T extends readonly unknown[] | []>(urls: string[]): Promise<T> {
  return Promise.all(urls.map((url) => http.get(url))) as Promise<T>
}

export type QueryParameter = string | number | boolean | null | undefined
export type QueryParameters = Record<string, QueryParameter | QueryParameter[]>

export function createQueryString(queryParameters: QueryParameters): string {
  const destination = new URLSearchParams()
  populateQueryParameters(destination, queryParameters)
  return destination.toString()
}

export function createUrl(path: string, queryParameters: QueryParameters = {}): string {
  const url = new URL(path, window.location.href)
  populateQueryParameters(url.searchParams, queryParameters)
  return url.pathname + url.search
}

function populateQueryParameters(destination: URLSearchParams, queryParameters: QueryParameters) {
  Object.entries(queryParameters).forEach(([name, valueOrValues]) => {
    if (valueOrValues) {
      if (Array.isArray(valueOrValues)) {
        valueOrValues.forEach((value) => {
          if (value) {
            destination.append(name, value.toString())
          }
        })
      } else {
        destination.set(name, valueOrValues.toString())
      }
    }
  })
}

export function useObjectUrl(data?: Blob) {
  const url = useMemo(() => {
    return data ? URL.createObjectURL(data) : undefined
  }, [data])
  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])
  return url
}

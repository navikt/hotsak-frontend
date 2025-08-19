import { toWeakETag } from './etag.ts'
import { HttpError } from './HttpError.ts'
import { contentTypeIsJson } from './response.ts'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface RequestOptions {
  versjon?: string | number
}

async function request<ResponseBody = unknown>(
  method: HttpMethod,
  url: string,
  body?: any,
  options: RequestOptions = {}
): Promise<ResponseBody> {
  const { versjon } = options
  try {
    const response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body == null ? {} : { 'Content-Type': 'application/json' }),
        ...(versjon == null ? {} : { 'If-Match': toWeakETag(versjon) }),
        'X-Requested-With': 'XMLHttpRequest',
      },
      ...(body == null ? {} : { body: JSON.stringify(body) }),
    })
    if (response.ok) {
      if (contentTypeIsJson(response)) {
        return (await response.json()) as ResponseBody
      } else {
        return undefined as ResponseBody
      }
    } else {
      return HttpError.reject(url, response)
    }
  } catch (err: unknown) {
    throw HttpError.wrap(err)
  }
}

export interface HttpClient {
  get<ResponseBody = unknown>(url: string, options?: RequestOptions): Promise<ResponseBody>
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
  async get<ResponseBody = unknown>(url: string, options?: RequestOptions): Promise<ResponseBody> {
    return request('GET', url, undefined, options)
  },
  async post<RequestBody = unknown, ResponseBody = unknown>(
    url: string,
    body?: RequestBody,
    options?: RequestOptions
  ): Promise<ResponseBody> {
    return request('POST', url, body, options)
  },
  async put<RequestBody = unknown, ResponseBody = unknown>(
    url: string,
    body?: RequestBody,
    options?: RequestOptions
  ): Promise<ResponseBody> {
    return request('PUT', url, body, options)
  },
  async delete(url: string, options?: RequestOptions): Promise<void> {
    return request('DELETE', url, undefined, options)
  },
}

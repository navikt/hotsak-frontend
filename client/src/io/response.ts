function getContentType(response: Response): string {
  return response.headers.get('Content-Type') ?? ''
}

export function contentTypeIsJson(response: Response): boolean {
  return getContentType(response).startsWith('application/json')
}

export function contentTypeIsPdf(response: Response): boolean {
  return getContentType(response).startsWith('application/pdf')
}

export function contentTypeIsText(response: Response): boolean {
  return getContentType(response).startsWith('text/')
}

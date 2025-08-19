export function contentTypeIsJson(response: Response): boolean {
  const contentType = response.headers.get('Content-Type') ?? ''
  return contentType.startsWith('application/json')
}

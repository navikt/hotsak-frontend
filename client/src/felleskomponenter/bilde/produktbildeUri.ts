import type { Media } from '../../generated/alternativprodukter.ts'

const imageProxyUrl = window.appSettings.IMAGE_PROXY_URL

export function produktbildeUri(media: Pick<Media, 'uri' | 'type' | 'priority'>[]): Maybe<string> {
  const image = media
    .filter((m) => m.type === 'IMAGE')
    .sort((a, b) => (Number(a.priority) || 0) - (Number(b.priority) || 0))[0]
  if (!image || !image.uri) {
    return undefined
  }
  return `${imageProxyUrl}/${image.uri}`
}

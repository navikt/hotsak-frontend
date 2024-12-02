// https://event-driven.io/en/how_to_use_etag_header_for_optimistic_concurrency/

export type WeakETag = `W/${string}`
export type ETag = WeakETag | string

export function isWeakETag(etag: ETag): etag is WeakETag {
  return etag.startsWith('W/')
}

export function getWeakETagValue(etag: WeakETag): string {
  return etag.substring('W/'.length)
}

export function toWeakETag(value: string | number): WeakETag {
  return `W/"${value}"`
}

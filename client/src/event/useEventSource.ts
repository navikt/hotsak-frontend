import { createEventSource } from 'eventsource-client'
import { useEffect, useState } from 'react'
import { type Predicate } from '../utils/predicate'
import { isFunction, isString } from '../utils/type'

export interface EventSourceProps {
  url: string | null
  event: string | Predicate<string>
}

export function useEventSource<T = unknown>(props: EventSourceProps) {
  const { url, event } = props

  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (!url) return

    const matchesEvent = isFunction(event) ? event : (messageEvent: string) => messageEvent === event

    const source = createEventSource({
      url,
      onMessage(message) {
        const messageEvent = message.event
        if (!isString(messageEvent) || !matchesEvent(messageEvent)) return
        try {
          setData(JSON.parse(message.data))
        } catch (cause: unknown) {
          setError(new Error('Failed to parse event source message', { cause }))
        }
      },
      onComment(comment) {
        console.debug('Event source comment:', comment)
      },
      fetch: window.fetch,
    })

    return () => source.close()
  }, [url, event])

  return { data, error }
}

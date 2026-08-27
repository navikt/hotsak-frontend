import { createEventSource } from 'eventsource-client'
import { useEffect, useState } from 'react'

export function useEventSource<T = unknown>(url: string | null, event: string) {
  const [data, setData] = useState<T>()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (!url) return

    const source = createEventSource({
      url,
      onMessage(message) {
        if (message.event !== event) return
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

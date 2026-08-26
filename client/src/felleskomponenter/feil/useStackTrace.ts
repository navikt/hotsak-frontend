import { useEffect, useState } from 'react'

type StackTraceString = string | null

export function useStackTrace(error?: Error): StackTraceString {
  const errorMessage = error?.message || null
  const [stackTrace, setStackTrace] = useState<StackTraceString>(null)
  useEffect(() => {
    formatStackTrace(error).then(setStackTrace)
  }, [errorMessage])
  return stackTrace
}

async function formatStackTrace(error?: Error): Promise<StackTraceString> {
  if (!(error instanceof Error)) return null
  try {
    const StackTrace = await import('stacktrace-js')
    const frames = await StackTrace.fromError(error)
    return frames
      .map((frame) => {
        return frame.toString()
      })
      .join('\n')
  } catch (err: unknown) {
    console.error(err)
    return null
  }
}

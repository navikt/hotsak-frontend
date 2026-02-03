import { useEffect } from 'react'
import { useLocalState } from '../state/useLocalState'
import { setIdentifier } from './umami'

export function useLogBruker() {
  const [userTrackingId] = useLocalState('userTrackingId', crypto.randomUUID())

  useEffect(() => {
    setIdentifier(userTrackingId)
  }, [userTrackingId])
}

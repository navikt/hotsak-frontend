import { useSakId } from './saksbilde/useSak.ts'

export function SakTitle() {
  const sakId = useSakId()
  if (!sakId) {
    return null
  }
  return <title>{`Hotsak - Sak ${sakId}`}</title>
}

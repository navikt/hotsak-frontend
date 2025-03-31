import { headerHøyde, personlinjeHøyde, søknadslinjeHøyde } from '../GlobalStyles'

export function ScrollContainer(props: { children: React.ReactNode; height?: string }) {
  const { children, height = `calc( 100vh - ( ${headerHøyde} + ${personlinjeHøyde} + ${søknadslinjeHøyde}) )` } = props
  return <div style={{ overflowY: 'auto', flexGrow: 1, height }}>{children}</div>
}

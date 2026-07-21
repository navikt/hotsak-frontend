import { MarkKnapp } from './hjelpere/MarkKnapp/MarkKnapp'

export function FetKnapp() {
  return (
    <MarkKnapp
      data-umami-event="Fetknapp"
      tittel="Fet"
      markKey="bold"
      ikon={<span style={{ fontWeight: 'bold', fontSize: '1rem' }}>F</span>}
      shortcuts={
        window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone' ? ['⌘ + B'] : ['Ctrl + B']
      }
    />
  )
}

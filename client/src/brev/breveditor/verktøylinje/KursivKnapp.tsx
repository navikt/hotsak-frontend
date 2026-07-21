import { MarkKnapp } from './hjelpere/MarkKnapp/MarkKnapp'

export function KursivKnapp() {
  return (
    <MarkKnapp
      data-umami-event="Kursivknapp"
      tittel="Kursiv"
      markKey="italic"
      ikon={
        <span
          style={{
            fontStyle: 'italic',
            fontSize: '1rem',
          }}
        >
          K
        </span>
      }
      shortcuts={
        window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone' ? ['⌘ + I'] : ['Ctrl + I']
      }
    />
  )
}

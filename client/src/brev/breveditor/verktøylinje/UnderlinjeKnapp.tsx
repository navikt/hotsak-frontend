import { MarkKnapp } from './hjelpere/MarkKnapp/MarkKnapp'

export function UnderlinjeKnapp() {
  return (
    <MarkKnapp
      data-umami-event="Underlinjeknapp"
      tittel="Underlinje"
      markKey="underline"
      ikon={
        <span
          style={{
            textDecoration: 'underline',
            fontSize: '1rem',
          }}
        >
          U
        </span>
      }
      shortcuts={
        window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone' ? ['⌘ + U'] : ['Ctrl + U']
      }
    />
  )
}

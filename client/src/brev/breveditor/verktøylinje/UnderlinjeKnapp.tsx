import MarkKnapp from './hjelpere/MarkKnapp/MarkKnapp.tsx'

const UnderlinjeKnapp = () => {
  return (
    <MarkKnapp
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

export default UnderlinjeKnapp

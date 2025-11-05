import MarkKnapp from './hjelpere/MarkKnapp.tsx'

const UnderlinjeKnapp = () => {
  return (
    <MarkKnapp
      tittel="Underlinje"
      markKey="underline"
      ikon={
        <span
          style={{
            textDecoration: 'underline',
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

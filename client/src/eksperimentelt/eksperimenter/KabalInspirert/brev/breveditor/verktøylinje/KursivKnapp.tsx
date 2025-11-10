import MarkKnapp from './hjelpere/MarkKnapp.tsx'

const KursivKnapp = () => {
  return (
    <MarkKnapp
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

export default KursivKnapp

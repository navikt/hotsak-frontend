import MarkKnapp from './hjelpere/MarkKnapp.tsx'

const FetKnapp = ({}: {}) => {
  return (
    <MarkKnapp
      tittel="Fet"
      markKey="bold"
      ikon={<span>F</span>}
      shortcuts={
        window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone' ? ['⌘ + B'] : ['Ctrl + B']
      }
    />
  )
}

export default FetKnapp

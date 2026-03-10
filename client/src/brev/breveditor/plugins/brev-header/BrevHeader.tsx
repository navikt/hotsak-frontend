import { PlateElement, PlateElementProps } from 'platejs/react'

export function BrevHeader({ children, ...props }: PlateElementProps) {
  return (
    <PlateElement {...props}>
      <div contentEditable={false} style={{ background: 'red', padding: '10px' }}>
        testitest {children}
      </div>
    </PlateElement>
  )
}

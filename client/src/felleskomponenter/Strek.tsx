import styled from 'styled-components'

export function Skillelinje({ color = 'default' }: { color?: 'default' | 'info' }) {
  return (
    <div>
      <Strek color={color} />
    </div>
  )
}

export const Strek = styled.hr<{ color: 'default' | 'info' }>`
  border: none;
  height: 1px;
  background-color: ${({ color }) => (color === 'info' ? 'var(--ax-border-info)' : 'var(--ax-border-neutral-subtle)')};
`

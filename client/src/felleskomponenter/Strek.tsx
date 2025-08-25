import styled from 'styled-components'

export function Skillelinje() {
  return (
    <div>
      <Strek />
    </div>
  )
}

export const Strek = styled.hr`
  border: none;
  height: 1px;
  background-color: var(--ax-border-neutral-subtle);
`

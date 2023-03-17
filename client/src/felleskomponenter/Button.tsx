import styled from 'styled-components'

export const Button = styled.button`
  font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
`

interface KnappeProps {
  gap?: string
}

const VenstrestilteKnapper = styled.div<KnappeProps>`
  display: flex;
  justify-content: flex-start;
  gap: ${(props) => (props.gap ? props.gap : '1rem')};
  padding-top: 2rem;
`

export const Knappepanel = ({ children, gap }: { children: React.ReactNode; gap?: string }) => {
  return (
    <div style={{ display: 'flex' }}>
      <VenstrestilteKnapper gap={gap}> {children}</VenstrestilteKnapper>
    </div>
  )
}

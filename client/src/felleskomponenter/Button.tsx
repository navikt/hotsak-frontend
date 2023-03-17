import styled from 'styled-components'

export const Button = styled.button`
  font-family: 'Source Sans Pro', Arial, Helvetica, sans-serif;
  cursor: pointer;
  background: none;
  border: none;
  outline: none;
`

const VenstrestilteKnapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  padding-top: 2rem;
`

export const Knappepanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex' }}>
      <VenstrestilteKnapper> {children}</VenstrestilteKnapper>
    </div>
  )
}

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
  gap: 1rem;
  margin-left: auto;
  padding-top: 2rem;
`

export const Knappepanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: 'flex' }}>
      <VenstrestilteKnapper> {children}</VenstrestilteKnapper>
    </div>
  )
}

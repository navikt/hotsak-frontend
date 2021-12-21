import styled from '@emotion/styled'
import { Tekst } from '../../felleskomponenter/typografi'

const Container = styled.div`
  margin-left: 1.4rem;
  margin-top: 0.5rem;
`

interface PageCounterProps {
  totalCount: number
  pageSize: number
  currentPage: number
}

export const PageCounter: React.FC<PageCounterProps> = ({ pageSize, totalCount, currentPage }) => {
  const førsteSynligeOppgave = pageSize * (currentPage - 1) + 1
  const sisteOppgave = førsteSynligeOppgave + pageSize - 1
  return (
    <>
      <Container>
        <Tekst>
          {`Viser ${førsteSynligeOppgave} - ${
            sisteOppgave > totalCount ? totalCount : sisteOppgave
          } av ${totalCount} saker`}
        </Tekst>
      </Container>
    </>
  )
}

import styled from 'styled-components'

import { Tekst } from '../../felleskomponenter/typografi'

interface PageCounterProps {
  totalElements: number
  pageSize: number
  currentPage: number
}

export function PageCounter({ pageSize, totalElements, currentPage }: PageCounterProps) {
  const førsteSynligeOppgave = pageSize * (currentPage - 1) + 1
  const sisteOppgave = førsteSynligeOppgave + pageSize - 1

  return (
    <>
      <Container>
        <Tekst>
          {`Viser ${førsteSynligeOppgave} - ${
            sisteOppgave > totalElements ? totalElements : sisteOppgave
          } av ${totalElements} saker`}
        </Tekst>
      </Container>
    </>
  )
}

const Container = styled.div`
  margin-left: 0.9rem;
  margin-top: 0.5rem;
`

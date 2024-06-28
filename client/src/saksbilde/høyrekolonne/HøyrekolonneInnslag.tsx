import styled from 'styled-components'

export const HøyrekolonneInnslag = styled.li`
  &:not(:last-of-type) {
    padding-bottom: var(--a-spacing-3);
    border-bottom: 1px solid var(--a-border-subtle);
  }
`

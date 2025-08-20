import styled from 'styled-components'

export const HøyrekolonneInnslag = styled.li`
  &:not(:last-of-type) {
    padding-bottom: var(--ax-space-16);
    border-bottom: 1px solid var(--ax-border-neutral-subtle);
  }
`

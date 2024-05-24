import styled from 'styled-components'

import { Heading, HeadingProps, HelpText, HelpTextProps } from '@navikt/ds-react'

interface HeadingMedHjelpetekstProps {
  children: string
  hjelpetekst: string
  level?: HeadingProps['level']
  placement?: HelpTextProps['placement']
}

export function HeadingMedHjelpetekst(props: HeadingMedHjelpetekstProps) {
  const { children, hjelpetekst, placement, level } = props
  return (
    <Container>
      <Heading size="xsmall" level={level} spacing>
        {children}
      </Heading>
      <HelpText placement={placement}>{hjelpetekst}</HelpText>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--a-spacing-2);
`

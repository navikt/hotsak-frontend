import { Heading, HeadingProps, HelpText, HelpTextProps } from '@navikt/ds-react'

import classes from './HeadingMedHjelpetekst.module.css'

interface HeadingMedHjelpetekstProps {
  children: string
  hjelpetekst: string
  level?: HeadingProps['level']
  placement?: HelpTextProps['placement']
}

export function HeadingMedHjelpetekst(props: HeadingMedHjelpetekstProps) {
  const { children, hjelpetekst, placement, level } = props
  return (
    <div className={classes.container}>
      <Heading size="xsmall" level={level} spacing>
        {children}
      </Heading>
      <HelpText placement={placement}>{hjelpetekst}</HelpText>
    </div>
  )
}

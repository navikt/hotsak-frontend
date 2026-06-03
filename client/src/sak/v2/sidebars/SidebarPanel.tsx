import { Box, Heading, HStack } from '@navikt/ds-react'
import type { ReactNode } from 'react'
import type { BoxProps } from '@navikt/ds-react'
import { Tekst } from '../../../felleskomponenter/typografi.tsx'
import classes from './SidebarPanel.module.css'

export interface SidebarPanelProps {
  tittel: string | ReactNode
  error?: false | string
  spacing?: boolean
  loading?: false | string
  paddingInline?: BoxProps['paddingInline']
  paddingBlock?: BoxProps['paddingBlock']
  children: ReactNode
  icon?: ReactNode
}

interface SidebarPanelHeadingProps {
  tittel: string | ReactNode
  icon?: ReactNode
}

export function SidebarPanelHeading({ tittel, icon }: SidebarPanelHeadingProps) {
  if (icon) {
    return (
      <HStack className={classes.headingRow} gap="space-8">
        {typeof tittel === 'string' ? (
          <Heading level="1" size="xsmall" spacing={false} textColor="subtle">
            {tittel}
          </Heading>
        ) : (
          tittel
        )}
        <span className={classes.icon}>{icon}</span>
      </HStack>
    )
  }

  if (typeof tittel === 'string') {
    return (
      <Heading level="1" size="xsmall" spacing={false} textColor="subtle">
        {tittel}
      </Heading>
    )
  }

  return <>{tittel}</>
}

/**
 * @see {@link VenstremenyCard}
 */
export function SidebarPanel(props: SidebarPanelProps) {
  const {
    tittel,
    loading,
    error,
    //spacing = true,
    icon,
    paddingInline = 'space-8 space-16',
    paddingBlock = 'space-4',
    children,
  } = props
  return (
    <SidebarPanelBox paddingInline={paddingInline} paddingBlock={paddingBlock}>
      <SidebarPanelHeading tittel={tittel} icon={icon} />
      {error && <Tekst>{error}</Tekst>}
      {loading && <Tekst>{loading}</Tekst>}
      {!loading && !error && children}
    </SidebarPanelBox>
  )
}

export interface SidebarPanelBoxProps {
  paddingInline?: BoxProps['paddingInline']
  paddingBlock?: BoxProps['paddingBlock']
  children: ReactNode
}

export function SidebarPanelBox(props: SidebarPanelBoxProps) {
  const { paddingInline = 'space-8 space-16', paddingBlock = 'space-16', children } = props
  return (
    <Box as="aside" paddingInline={paddingInline} paddingBlock={paddingBlock}>
      {children}
    </Box>
  )
}

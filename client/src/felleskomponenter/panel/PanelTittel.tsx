import { XMarkIcon } from '@navikt/aksel-icons'
import { Button, Heading, HStack, type HStackProps } from '@navikt/ds-react'

export function PanelTittel({
  tittel,
  icon,
  lukkPanel,
  paddingInline = 'space-0 space-12',
}: {
  tittel: string
  icon?: React.ReactNode
  lukkPanel(): void
  paddingInline?: HStackProps['paddingInline']
}) {
  return (
    <HStack justify="space-between" paddingInline={paddingInline} align={'center'}>
      <HStack gap="space-8" align="center">
        <Heading level="1" size="xsmall" spacing={false}>
          {tittel}
        </Heading>
        {icon && icon}
      </HStack>

      <Button
        data-color="neutral"
        variant="tertiary"
        size="small"
        icon={<XMarkIcon title={`Lukk ${tittel}`} fontSize="20px" />}
        onClick={lukkPanel}
      />
    </HStack>
  )
}

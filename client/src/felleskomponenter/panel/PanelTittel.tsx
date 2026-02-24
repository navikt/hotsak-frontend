import { XMarkIcon } from '@navikt/aksel-icons'
import { Button, Heading, HStack, HStackProps } from '@navikt/ds-react'

export const PanelTittel = ({
  tittel,
  lukkPanel,
  paddingInline = 'space-0 space-12',
}: {
  tittel: string
  lukkPanel: () => void
  paddingInline?: HStackProps['paddingInline']
}) => {
  return (
    <HStack justify="space-between" paddingInline={paddingInline} align={'center'}>
      <Heading level="1" size="xsmall" spacing={false}>
        {tittel}
      </Heading>
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

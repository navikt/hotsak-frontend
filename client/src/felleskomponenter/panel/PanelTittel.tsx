import { Button, Heading, HStack } from '@navikt/ds-react'
import { XMarkIcon } from '@navikt/aksel-icons'

export const PanelTittel = ({ tittel, lukkPanel }: { tittel: string; lukkPanel: () => void }) => {
  return (
    <HStack justify="space-between" paddingInline={'space-0 space-12'} align={'center'}>
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

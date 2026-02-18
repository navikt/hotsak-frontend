import { Button, Heading, HStack } from '@navikt/ds-react'
import { XMarkIcon } from '@navikt/aksel-icons'

export const PanelTittel = ({ tittel, lukkPanel }: { tittel: string; lukkPanel: () => void }) => {
  return (
    <HStack justify="space-between" paddingBlock={'space-8'} paddingInline={'space-16'}>
      <Heading level="1" size="small" spacing={false}>
        {tittel}
      </Heading>
      <Button
        data-color="neutral"
        variant="tertiary"
        size="small"
        icon={<XMarkIcon title={`Lukk ${tittel}`} fontSize="1.5rem" />}
        onClick={lukkPanel}
      />
    </HStack>
  )
}

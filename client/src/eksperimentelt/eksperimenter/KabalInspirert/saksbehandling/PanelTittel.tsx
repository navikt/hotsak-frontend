import { Button, Heading, HStack } from '@navikt/ds-react'
import { XMarkIcon } from '@navikt/aksel-icons'

export const PanelTittel = ({ tittel, lukkPanel }: { tittel: string; lukkPanel: () => void }) => {
  return (
    <HStack justify="space-between">
      <Heading level="1" size="small" spacing={false}>
        {tittel}
      </Heading>
      <Button
        variant="tertiary-neutral"
        size="small"
        icon={<XMarkIcon title="a11y-title" fontSize="1.5rem" />}
        onClick={lukkPanel}
      />
    </HStack>
  )
}

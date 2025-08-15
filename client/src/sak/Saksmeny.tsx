import { ActionMenu } from '@navikt/ds-react'

export function Saksmeny() {
  return (
    <>
      <ActionMenu.Group label="Sak">
        <ActionMenu.Item onSelect={() => {}}>Overfør sak til Gosys</ActionMenu.Item>
      </ActionMenu.Group>
    </>
  )
}

import { Dialog, Heading, HStack, Tag, VStack } from '@navikt/ds-react'

import { formaterTaster, HOTKEY_GRUPPER } from './hotkeys.ts'
import classes from './HurtigtasterModal.module.css'

export function HurtigtasterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <Dialog.Popup closeOnOutsideClick width="400px">
        <Dialog.Header>
          <Dialog.Title>Hurtigtaster</Dialog.Title>
        </Dialog.Header>
        <Dialog.Body>
          <VStack gap="space-12">
            {HOTKEY_GRUPPER.map((gruppe) => (
              <VStack key={gruppe.label} gap="space-6">
                <Heading size="xsmall" level="3">
                  {gruppe.label}
                </Heading>
                {Object.values(gruppe.hotkeys).map((hotkey) => (
                  <HStack key={hotkey.description} justify="space-between" align="center" wrap={false}>
                    <span>{hotkey.description}</span>
                    <HStack gap="space-4" wrap={false}>
                      {formaterTaster(hotkey).map((tast) => (
                        <Tast key={tast}>{tast}</Tast>
                      ))}
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            ))}
          </VStack>
        </Dialog.Body>
      </Dialog.Popup>
    </Dialog>
  )
}

function Tast({ children }: { children: string }) {
  return (
    <Tag size="small" variant="neutral" className={classes.tast}>
      {children}
    </Tag>
  )
}

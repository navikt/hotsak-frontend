import { Heading, HGrid, HStack, Modal, Tag, VStack } from '@navikt/ds-react'
import { useRef } from 'react'

import { formaterTaster, HOTKEY_GRUPPER } from './hotkeys.ts'

export function HurtigtasterModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)

  return (
    <Modal
      ref={ref}
      open={open}
      onClose={onClose}
      closeOnBackdropClick
      header={{ heading: 'Hurtigtaster', size: 'small' }}
      width="400px"
    >
      <Modal.Body>
        <VStack gap="space-12">
          {HOTKEY_GRUPPER.map((gruppe) => (
            <VStack key={gruppe.label} gap="space-6">
              <Heading size="xsmall" level="3">
                {gruppe.label}
              </Heading>
              {Object.values(gruppe.hotkeys).map((hotkey) => (
                <HStack key={hotkey.description} justify="space-between" align="center" wrap={false}>
                  <span>{hotkey.description}</span>
                  <HGrid gap="space-6" columns={2}>
                    {formaterTaster(hotkey).map((tast) => (
                      <Tag key={tast} size="small" variant="neutral">
                        {tast}
                      </Tag>
                    ))}
                  </HGrid>
                </HStack>
              ))}
            </VStack>
          ))}
        </VStack>
      </Modal.Body>
    </Modal>
  )
}

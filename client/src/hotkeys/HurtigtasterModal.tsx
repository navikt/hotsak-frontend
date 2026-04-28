import { Heading, HStack, Modal, Tag, VStack } from '@navikt/ds-react'
import { useRef } from 'react'

import { formaterTaster, HOTKEY_GRUPPER } from './hotkeys.ts'
import classes from './HurtigtasterModal.module.css'

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
      </Modal.Body>
    </Modal>
  )
}

function Tast({ children }: { children: string }) {
  return (
    <Tag size="small" variant="neutral" className={classes.tast}>
      {children}
    </Tag>
  )
}

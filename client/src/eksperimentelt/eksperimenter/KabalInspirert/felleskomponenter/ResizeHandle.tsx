import { CaretLeftRightIcon } from '@navikt/aksel-icons'
import { VStack } from '@navikt/ds-react'
import { PanelResizeHandle } from 'react-resizable-panels'
import styles from './ResizeHandle.module.css'

export const ResizeHandle = () => {
  return (
    <PanelResizeHandle className={styles.resizeHandle}>
      <VStack>
        <CaretLeftRightIcon />
      </VStack>
    </PanelResizeHandle>
  )
}

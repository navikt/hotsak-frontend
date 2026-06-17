import { Detail, HStack, Loader, Textarea, type TextareaProps, VStack } from '@navikt/ds-react'
import { type ChangeEventHandler, type ReactNode } from 'react'

import classes from './Fritekst.module.css'

export interface FritekstProps extends Omit<TextareaProps, 'onChange'> {
  loading?: boolean
  onTextChange?(value: string): void
}

export function Fritekst(props: FritekstProps) {
  const { loading, onTextChange, ...rest } = props
  let handleChange: ChangeEventHandler<HTMLTextAreaElement> | undefined = undefined
  if (onTextChange) {
    handleChange = (event) => {
      onTextChange(event.target.value)
    }
  }

  return (
    <VStack>
      <Textarea size="small" minRows={5} maxRows={20} onChange={handleChange} {...rest} />
      <Bakgrunnslagring>
        {loading && (
          <>
            <span>
              <Loader size="xsmall" />
            </span>
            <span>
              <Detail>Lagrer</Detail>
            </span>
          </>
        )}
      </Bakgrunnslagring>
    </VStack>
  )
}

export function Bakgrunnslagring({ children }: { children: ReactNode }) {
  return <HStack className={classes.bakgrunnslagring}>{children}</HStack>
}

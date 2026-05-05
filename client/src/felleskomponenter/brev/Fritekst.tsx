import { ChangeEvent } from 'react'

import { Detail, HStack, Loader, Textarea, VStack } from '@navikt/ds-react'
import classes from './Fritekst.module.css'

export function Bakgrunnslagring({ children }: { children: React.ReactNode }) {
  return <HStack className={classes.bakgrunnslagring}>{children}</HStack>
}

export const Fritekst = ({
  label,
  fritekst,
  beskrivelse,
  valideringsfeil,
  lagrer,
  onTextChange,
}: {
  label: string
  fritekst: string
  beskrivelse: string
  valideringsfeil?: string
  lagrer: boolean
  onTextChange: (value: string) => void
}) => {
  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(event.target.value)
  }

  return (
    <VStack>
      <Textarea
        minRows={5}
        maxRows={20}
        label={label}
        error={valideringsfeil}
        description={beskrivelse}
        size="small"
        value={fritekst}
        onChange={(event) => onChange(event)}
      />
      <Bakgrunnslagring>
        {lagrer && (
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

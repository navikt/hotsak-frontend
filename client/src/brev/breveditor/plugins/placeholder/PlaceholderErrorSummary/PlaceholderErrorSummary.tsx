import { Button, ErrorSummary } from '@navikt/ds-react'
import { PlaceholderFeil } from '../PlaceholderFeil'
import styles from './PlaceholderErrorSummary.module.css'
import { useBreveditorContext } from '../../../Breveditor'
import { XMarkIcon } from '@navikt/aksel-icons'
import { useState } from 'react'

interface Props {
  feil: PlaceholderFeil[]
}

export const PlaceholderErrorSummary = ({ feil }: Props) => {
  const { focusPath } = useBreveditorContext()
  const [erSynlig, seterSynlig] = useState(true)

  if (!erSynlig || feil.length === 0) return null

  return (
    <ErrorSummary
      size="small"
      heading=" Du må fylle ut følgende felt før du kan ferdigstille utkastet"
      className={styles.placeholderErrorSummary}
    >
      <Button
        data-color="neutral"
        variant="tertiary"
        size="small"
        icon={<XMarkIcon title="a11y-title" fontSize="1.5rem" />}
        onClick={() => seterSynlig(false)}
        style={{
          position: 'absolute',
          right: '0.5em',
          top: '0.5rem',
        }}
      />
      {feil.map((f, i) => (
        <ErrorSummary.Item
          key={`${f.placeholder}-${i}`}
          href="#"
          onClick={(e: { preventDefault: () => void }) => {
            e.preventDefault()
            focusPath(f.path)
          }}
        >
          {f.placeholder}
        </ErrorSummary.Item>
      ))}
    </ErrorSummary>
  )
}

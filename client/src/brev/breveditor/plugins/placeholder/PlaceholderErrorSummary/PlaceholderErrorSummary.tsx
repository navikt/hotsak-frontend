import { XMarkIcon } from '@navikt/aksel-icons'
import { Button, ErrorSummary } from '@navikt/ds-react'
import styles from './PlaceholderErrorSummary.module.css'
import { useBreveditorContext } from '../../../BreveditorContext'
import { useBrevContext } from '../../../../BrevContext'
import { PlaceholderFeil } from '../PlaceholderFeil'

export const PlaceholderErrorSummary = () => {
  const { focusPath } = useBreveditorContext()
  const { placeholderFeil, synligKryssKnapp, setSynligKryssKnapp } = useBrevContext()

  if (!synligKryssKnapp || placeholderFeil.length === 0) return null

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
        onClick={() => setSynligKryssKnapp(false)}
        style={{
          position: 'absolute',
          right: '0.5em',
          top: '0.5rem',
        }}
      />
      {placeholderFeil.map((f: PlaceholderFeil, i: number) => (
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

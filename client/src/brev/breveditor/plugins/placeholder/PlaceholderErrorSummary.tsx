import { ErrorSummary } from '@navikt/ds-react'
import { PlaceholderFeil } from './PlaceholderFeil'
import './PlaceholderErrorSummary.css'
import { useBreveditorContext } from '../../Breveditor'

interface Props {
  feil: PlaceholderFeil[]
}

export const PlaceholderErrorSummary = ({ feil }: Props) => {
  const { focusPath } = useBreveditorContext()

  if (feil.length === 0) return null

  return (
    <ErrorSummary
      size="small"
      heading=" Du må fylle ut følgende felt før du kan ferdigstille utkastet"
      className="placeholder-error-summary"
    >
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

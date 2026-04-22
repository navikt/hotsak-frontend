import { type FallbackProps } from 'react-error-boundary'

import { HttpError } from '../io/HttpError.ts'
import { toError } from '../utils/error.ts'
import { Feilside } from './Feilside'

export type GlobalFeilsideProps = FallbackProps

export function GlobalFeilside(props: GlobalFeilsideProps) {
  const error = toError(props.error)
  return (
    <>
      {HttpError.isHttpError(error) ? (
        <Feilside statusCode={error.status} error={error} />
      ) : (
        <Feilside statusCode={500} error={error} />
      )}
    </>
  )
}

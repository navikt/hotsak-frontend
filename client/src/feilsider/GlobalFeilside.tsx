import { Feilside } from './Feilside'
import { HttpError } from '../io/HttpError.ts'
import { toError } from '../utils/error.ts'

export interface GlobalFeilsideProps {
  error: unknown
}

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

import { Feilside } from './Feilside'
import { HttpError } from '../io/HttpError.ts'

export interface GlobalFeilsideProps {
  error: Error
}

export function GlobalFeilside({ error }: GlobalFeilsideProps) {
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

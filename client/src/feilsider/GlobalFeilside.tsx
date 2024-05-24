import { isResponseError } from '../io/http'

import { Feilside } from './Feilside'

export interface GlobalFeilsideProps {
  error: Error
}

export function GlobalFeilside({ error }: GlobalFeilsideProps) {
  return (
    <>
      {isResponseError(error) ? (
        <Feilside statusCode={error.statusCode} error={error} />
      ) : (
        <Feilside statusCode={500} error={error} />
      )}
    </>
  )
}

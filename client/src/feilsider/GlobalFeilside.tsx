import React from 'react'

import { isResponseError } from '../io/http'

import { Feilside } from './Feilside'

export const GlobalFeilside: React.VFC<{ error: Error }> = ({ error }) => {
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

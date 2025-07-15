import { GraphQLClient, RequestDocument, Variables } from 'graphql-request'
import { useCallback, useState } from 'react'
import useSWR, { SWRConfiguration, SWRResponse } from 'swr'

import { toError } from '../utils/error.ts'
import { pushError } from '../utils/faro.ts'

function graphQLFetcher<T>(client: GraphQLClient): (key: [RequestDocument, object]) => Promise<T> {
  return async ([query, variables]) => {
    try {
      return client.request(query, variables)
    } catch (err: unknown) {
      const error = toError(err)
      pushError(error)
      throw error
    }
  }
}

/**
 * GraphQL-versjon av `useSWR`.
 */
export function useGraphQLQuery<T, V extends Variables = Variables>(
  client: GraphQLClient,
  query: RequestDocument | null,
  variables: V,
  configuration?: SWRConfiguration<T, Error>
): SWRResponse<T, Error> {
  return useSWR<T, Error>(query === null ? null : [query, variables], graphQLFetcher<T>(client), configuration)
}

export function useGraphQLExecute<T, V extends Variables = Variables>(client: GraphQLClient, query: RequestDocument) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (variables: V): Promise<void> => {
      setLoading(true)
      try {
        setData(await client.request<T>(query, variables))
      } catch (err: unknown) {
        const error = toError(err)
        pushError(error)
        setError(error)
      } finally {
        setLoading(false)
      }
    },
    [client, query]
  )

  return {
    loading,
    data,
    error,
    execute,
  }
}

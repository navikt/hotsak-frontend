import { GraphQLClient, RequestOptions, Variables } from 'graphql-request'
import useSWR, { SWRConfiguration, SWRResponse } from 'swr'

import { toError } from '../utils/error.ts'
import { pushError } from '../utils/faro.ts'

function graphQLFetcher<T>(client: GraphQLClient): (key: RequestOptions<Variables, T>) => Promise<T> {
  return async (key) => {
    try {
      return client.request<T>(key)
    } catch (err: unknown) {
      const error = toError(err)
      pushError(error)
      throw error
    }
  }
}

type GraphQLKey<T, V extends Variables = Variables> = RequestOptions<V, T> | null

/**
 * GraphQL-versjon av `useSWR`.
 */
export function useGraphQLQuery<T, V extends Variables = Variables>(
  client: GraphQLClient,
  key: GraphQLKey<T, V> | (() => GraphQLKey<T, V>),
  configuration?: SWRConfiguration<T, Error>
): SWRResponse<T, Error> {
  return useSWR<T, Error>(key, graphQLFetcher<T>(client), configuration)
}

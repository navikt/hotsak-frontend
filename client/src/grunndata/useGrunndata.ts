import { RequestDocument, Variables } from 'graphql-request'
import type { SWRConfiguration } from 'swr'

import { useGraphQLExecute, useGraphQLQuery } from '../graphql/useGraphQL.ts'
import { grunndataClient } from './grunndataClient.ts'

export function useAlternativprodukterExecute<T, V extends Variables = Variables>(query: RequestDocument) {
  return useGraphQLExecute<T, V>(grunndataClient.alternativprodukter, query)
}

export function useAlternativprodukterQuery<T, V extends Variables = Variables>(
  query: RequestDocument,
  variables: V,
  configuration?: SWRConfiguration<T, Error>
) {
  return useGraphQLQuery<T, V>(grunndataClient.alternativprodukter, query, variables, configuration)
}

export function useGrunndataExecute<T, V extends Variables = Variables>(query: RequestDocument) {
  return useGraphQLExecute<T, V>(grunndataClient.grunndata, query)
}

export function useGrunndataQuery<T, V extends Variables = Variables>(
  query: RequestDocument,
  variables: V,
  configuration?: SWRConfiguration<T, Error>
) {
  return useGraphQLQuery<T, V>(grunndataClient.grunndata, query, variables, configuration)
}

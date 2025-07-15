import { RequestDocument, Variables } from 'graphql-request'

import { useGraphQLExecute, useGraphQLQuery } from '../graphql/useGraphQL.ts'
import { grunndataClient } from './grunndataClient.ts'
import { SWRConfiguration } from 'swr'

export function useGrunndataAlternativprodukterExecute<T, V extends Variables = Variables>(query: RequestDocument) {
  return useGraphQLExecute<T, V>(grunndataClient.alternativprodukter, query)
}

export function useGrunndataAlternativprodukterQuery<T, V extends Variables = Variables>(
  query: RequestDocument,
  variables: V,
  configuration?: SWRConfiguration<T, Error>
) {
  return useGraphQLQuery<T, V>(grunndataClient.alternativprodukter, query, variables, configuration)
}

export function useGrunndataHjelpemidlerExecute<T, V extends Variables = Variables>(query: RequestDocument) {
  return useGraphQLExecute<T, V>(grunndataClient.hjelpemidler, query)
}

export function useGrunndataHjelpemidlerQuery<T, V extends Variables = Variables>(
  query: RequestDocument,
  variables: V,
  configuration?: SWRConfiguration<T, Error>
) {
  return useGraphQLQuery<T, V>(grunndataClient.hjelpemidler, query, variables, configuration)
}

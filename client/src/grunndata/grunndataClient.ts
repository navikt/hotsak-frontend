import { GraphQLClient } from 'graphql-request'

function url(path: string): string {
  return new URL(path, window.location.href).toString()
}

export const grunndataClient = {
  alternativprodukter: new GraphQLClient(url('/alternativprodukter-api/graphql')),
  grunndata: new GraphQLClient(url('/grunndata-api/graphql')),
}

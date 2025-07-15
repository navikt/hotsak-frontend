import { GraphQLClient } from 'graphql-request'

function url(path: string): string {
  return new URL(path, window.location.href).toString()
}

export const grunndataClient = {
  alternativprodukter: new GraphQLClient(url('/finnalternativprodukt-api/graphql')),
  hjelpemidler: new GraphQLClient(url('/finnhjelpemiddel-api/graphql')),
}

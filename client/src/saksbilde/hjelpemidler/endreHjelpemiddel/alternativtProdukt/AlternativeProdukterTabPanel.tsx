import { Box, Heading } from '@navikt/ds-react'
import { Paginering } from '../../../../felleskomponenter/Paginering'
import { AlternativeProduct } from '../../useAlternativeProdukter'
import { BegrunnelseForBytte } from '../BegrunnelseForBytte'
import { PAGE_SIZE } from '../EndreHjelpemiddelModal'
import { EndreHjelpemiddelType } from '../endreHjelpemiddelTypes'
import { Loading } from '../Loading'
import { AlternativtProduktVelger } from './AlternativtProduktVelger'

export function AlternativeProdukterTabPanel({
  alternativeProdukter,
  isLoading,
  harPaginering,
  pageNumber,
  pageSize,
  totalElements,
  onPageChange,
  produktValgt,
}: {
  alternativeProdukter: AlternativeProduct[]
  isLoading: boolean
  harPaginering: boolean
  pageNumber: number
  pageSize: number
  totalElements: number
  produktValgt: boolean
  onPageChange: (page: number) => void
}) {
  return (
    <Box paddingBlock="space-24 space-0">
      {produktValgt && (
        <Heading level="1" size="small">
          Velg begrunnelse for å bytte hjelpemiddel
        </Heading>
      )}
      {!produktValgt ? (
        <>
          {isLoading ? (
            <Loading count={PAGE_SIZE} />
          ) : (
            <>
              <AlternativtProduktVelger alternativeProdukter={alternativeProdukter} />
              {harPaginering && (
                <Paginering
                  pageNumber={pageNumber}
                  pageSize={pageSize}
                  totalElements={totalElements}
                  tekst="produkter"
                  onPageChange={onPageChange}
                />
              )}
            </>
          )}
        </>
      ) : (
        <BegrunnelseForBytte type={EndreHjelpemiddelType.ALTERNATIVT_PRODUKT} />
      )}
    </Box>
  )
}

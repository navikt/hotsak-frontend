import { WheelchairIcon } from '@navikt/aksel-icons'
import { Tag, VStack } from '@navikt/ds-react'

import { useUtlånoversikt } from '../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useUtlånoversikt'
import { useSak } from '../../saksbilde/useSak'

export function UtlånsoversiktIcon() {
  const { sak } = useSak()

  const { antallUtlånteHjelpemidler, error, isLoading } = useUtlånoversikt(
    sak?.data.bruker.fnr,
    sak?.data.vedtak?.vedtaksgrunnlag
  )

  return (
    <VStack align="center" gap="space-0">
      <WheelchairIcon title="Utlånsoversikt" />
      {!isLoading && !error && (
        <Tag
          variant={`${antallUtlånteHjelpemidler > 0 ? 'info-moderate' : 'neutral-moderate'}`}
          size="xsmall"
          aria-hidden="true"
        >
          {antallUtlånteHjelpemidler}
        </Tag>
      )}
    </VStack>
  )
}

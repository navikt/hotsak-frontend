import { Button, Heading, Modal } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { Paginering } from '../../../../felleskomponenter/Paginering'
import { AlternativeProduct } from '../../useAlternativeProdukter'
import { BegrunnelseForBytte } from '../BegrunnelseForBytte'
import { AlternativtProduktVelger } from './AlternativtProduktVelger'
import { PAGE_SIZE } from '../EndreHjelpemiddelModal'
import { EndreArtikkelData, EndreHjelpemiddelType } from '../endreHjelpemiddelTypes'
import { Loading } from '../Loading'
import { useUmami } from '../../../../sporing/useUmami'

export function AlternativeProdukterTabPanel({
  alternativeProdukter,
  isLoading,
  harPaginering,
  pageNumber,
  pageSize,
  totalElements,
  onPageChange,
  onSubmit,
  onCancel,
  submitting,
}: {
  alternativeProdukter: AlternativeProduct[]
  isLoading: boolean
  harPaginering: boolean
  pageNumber: number
  pageSize: number
  totalElements: number
  onPageChange: (page: number) => void
  onSubmit: (data: EndreArtikkelData) => Promise<void>
  onCancel: () => void
  submitting: boolean
}) {
  const [produktValgt, setProdukterValgt] = useState(false)
  const { logSkjemaFullført } = useUmami()

  const methods = useForm<EndreArtikkelData>({
    defaultValues: {
      endretProdukt: [],
      endreBegrunnelse: '',
      endreBegrunnelseFritekst: '',
    },
  })

  const handleFormSubmit = async (data: EndreArtikkelData) => {
    if (!produktValgt) {
      setProdukterValgt(true)
    } else {
      logSkjemaFullført({
        komponent: 'EndreHjelpemiddelModal',
        valgtAlternativ: data.endretProdukt[0],
      })
      await onSubmit(data)
      setProdukterValgt(false)
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          <Heading level="1" size="small">
            {!produktValgt ? `Alternativer` : `Velg begrunnelse for å bytte hjelpemiddel`}
          </Heading>

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
        </Modal.Body>

        <Modal.Footer>
          <Button type="submit" variant="primary" size="small" loading={submitting}>
            {!produktValgt ? 'Lagre endring' : 'Ferdig'}
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="small"
            onClick={() => {
              setProdukterValgt(false)
              onCancel()
            }}
          >
            Avbryt
          </Button>
        </Modal.Footer>
      </form>
    </FormProvider>
  )
}

import { Box, Button, Heading, HGrid, HStack, Modal, Skeleton } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  AlternativeProduct,
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
} from '../useAlternativeProdukter.ts'
import { AlternativtProduktVelger } from './AlternativtProduktVelger.tsx'
import { BegrunnelseForBytte } from './BegrunnelseForBytte.tsx'
import {
  EndretHjelpemiddelBegrunnelse,
  EndretHjelpemiddelBegrunnelseLabel,
  EndretHjelpemiddelRequest,
} from '../../../types/types.internal.ts'
import { Paginering } from '../../../felleskomponenter/Paginering.tsx'

interface AlternativProduktModalProps {
  åpen: boolean
  hjelpemiddelId: string
  hmsArtNr: string
  alternativeProdukter?: AlternativeProduct[]
  harOppdatertLagerstatus: boolean
  onLagre(endreHjelpemiddel: EndretHjelpemiddelRequest): void | Promise<void>
  onLukk(): void
}

const PAGE_SIZE = 4

export function AlternativeProdukterModal(props: AlternativProduktModalProps) {
  const {
    åpen,
    hjelpemiddelId,
    hmsArtNr,
    alternativeProdukter: alternativeProdukterInitial = ingenAlternativeProdukterForHmsArtNr,
    harOppdatertLagerstatus,
    onLagre,
    onLukk,
  } = props
  const [nyttProduktValgt, setNyttProduktValgt] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const ref = useRef<HTMLDialogElement>(null)

  const { isLoading, alternativeProdukterByHmsArtNr, pageNumber, pageSize, totalElements, onPageChange } =
    useAlternativeProdukter(åpen && !harOppdatertLagerstatus ? [hmsArtNr] : [], PAGE_SIZE, false)

  const alternativeProdukter = harOppdatertLagerstatus
    ? alternativeProdukterInitial
    : (alternativeProdukterByHmsArtNr[hmsArtNr] ?? ingenAlternativeProdukterForHmsArtNr)

  const methods = useForm<EndreArtikkelData>({
    defaultValues: {
      endretProdukt: '',
      endreBegrunnelse: undefined,
      endreBegrunnelseFritekst: '',
    },
  })

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width="650px"
      open={åpen}
      onClose={() => {
        setNyttProduktValgt(false)
        onLukk()
      }}
      size="small"
      aria-label={'Endre hjelpemiddel'}
    >
      <Modal.Header>
        <Heading level="1" size="small">
          {!nyttProduktValgt ? `Alternativer` : `Velg begrunnelse for å bytte hjelpemiddel`}
        </Heading>
      </Modal.Header>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(async (data) => {
            if (!nyttProduktValgt) {
              setNyttProduktValgt(true)
            } else {
              setSubmitting(true)
              const begrunnelseFritekst =
                data.endreBegrunnelse === EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                  ? data.endreBegrunnelseFritekst
                  : EndretHjelpemiddelBegrunnelseLabel.get(data.endreBegrunnelse!)
              await onLagre({
                hjelpemiddelId: hjelpemiddelId,
                hmsArtNr: data.endretProdukt[0] ?? '',
                begrunnelse: data.endreBegrunnelse!,
                begrunnelseFritekst: begrunnelseFritekst,
              })
              setSubmitting(false)
              setNyttProduktValgt(false)
              onLukk()
            }
          })}
        >
          <Modal.Body>
            {!nyttProduktValgt ? (
              <>
                {isLoading ? (
                  <Loading count={4} />
                ) : (
                  <>
                    <AlternativtProduktVelger alternativeProdukter={alternativeProdukter} />
                    {!harOppdatertLagerstatus && (
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
              <BegrunnelseForBytte />
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" variant="primary" size="small" loading={submitting}>
              {!nyttProduktValgt ? 'Lagre endring' : 'Ferdig'}
            </Button>
            <Button
              type="button"
              variant="tertiary"
              size="small"
              onClick={() => {
                setNyttProduktValgt(false)
                onLukk()
              }}
            >
              Avbryt
            </Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  )
}

interface EndreArtikkelData {
  endretProdukt: string
  endreBegrunnelse: EndretHjelpemiddelBegrunnelse | undefined
  endreBegrunnelseFritekst: ''
}

function Loading({ count }: { count: number }) {
  return (
    <HGrid columns="1fr 1fr" gap="4">
      {[...Array(count).keys()].map((it) => (
        <LoadingCard key={it} />
      ))}
    </HGrid>
  )
}

function LoadingCard() {
  return (
    <div>
      <Box borderWidth="1" borderColor="border-subtle" borderRadius="large" padding="4">
        <Skeleton variant="rectangle" width="100%" height={200} />
        <Box marginBlock="2">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="50%" />
          <Skeleton variant="text" width="50%" />
        </Box>
        <Box marginBlock="2">
          <Skeleton variant="text" width="80%" />
        </Box>
        <Skeleton variant="text" width="50%" />
      </Box>
      <HStack justify="center" paddingBlock="2 0">
        <Skeleton variant="rectangle" width="50%" height={40} />
      </HStack>
    </div>
  )
}

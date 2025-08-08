import { Box, Button, Heading, HGrid, HStack, Modal, Skeleton, VStack } from '@navikt/ds-react'
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
import { logUmamiHendelse, UMAMI_TAKSONOMI } from '../../../utils/umami.ts'

interface AlternativProduktModalProps {
  åpen: boolean
  hjelpemiddelId: string
  hmsArtNr: string
  alternativeProdukter?: AlternativeProduct[]
  harOppdatertLagerstatus: boolean
  onLagre(endreHjelpemiddel: EndretHjelpemiddelRequest): void | Promise<void>
  onLukk(): void
}

const PAGE_SIZE = 6

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

  const {
    isLoading,
    alternativeProdukterByHmsArtNr,
    harPaginering,
    pageNumber,
    pageSize,
    totalElements,
    onPageChange,
  } = useAlternativeProdukter(åpen && !harOppdatertLagerstatus ? [hmsArtNr] : [], PAGE_SIZE, false)

  const alternativeProdukter = harOppdatertLagerstatus
    ? alternativeProdukterInitial
    : (alternativeProdukterByHmsArtNr[hmsArtNr] ?? ingenAlternativeProdukterForHmsArtNr)

  const methods = useForm<EndreArtikkelData>({
    defaultValues: {
      endretProdukt: [],
      endreBegrunnelse: '',
      endreBegrunnelseFritekst: '',
    },
  })

  return (
    <Modal
      ref={ref}
      closeOnBackdropClick={false}
      width="900px"
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
              logUmamiHendelse(UMAMI_TAKSONOMI.KNAPP_KLIKKET, {
                tekst: 'Lagre endret alternativ produkt',
                valgtAlternativ: data.endretProdukt[0],
              })
              setSubmitting(true)
              const begrunnelse = data.endreBegrunnelse as EndretHjelpemiddelBegrunnelse
              const begrunnelseFritekst =
                begrunnelse === EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
                  ? data.endreBegrunnelseFritekst
                  : EndretHjelpemiddelBegrunnelseLabel.get(begrunnelse)
              await onLagre({
                hjelpemiddelId,
                hmsArtNr: data.endretProdukt[0] ?? '',
                begrunnelse,
                begrunnelseFritekst,
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
                logUmamiHendelse(UMAMI_TAKSONOMI.KNAPP_KLIKKET, {
                  tekst: 'Avbryt endre til alternativt produkt',
                })
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
  endretProdukt: string[]
  endreBegrunnelse: EndretHjelpemiddelBegrunnelse | ''
  endreBegrunnelseFritekst: string | ''
}

function Loading({ count }: { count: number }) {
  return (
    <>
      <HGrid columns="1fr 1fr 1fr" gap="3">
        {[...Array(count).keys()].map((it) => (
          <LoadingCard key={it} />
        ))}
      </HGrid>
      <Box marginBlock="3 0" style={{ height: 64 }} />
    </>
  )
}

function LoadingCard() {
  return (
    <VStack gap="3">
      <Box borderWidth="1" borderColor="border-subtle" borderRadius="large" padding="4">
        <VStack gap="3">
          <Skeleton variant="rectangle" width="100%" height={185} />
          <Skeleton variant="rectangle" width="90%" height={64} />
          <Skeleton variant="rectangle" width="60%" height={24} />
          <Skeleton variant="text" width="60%" height={20} />
        </VStack>
      </Box>
      <HStack justify="center">
        <Skeleton variant="rectangle" width="50%" height={32} />
      </HStack>
    </VStack>
  )
}

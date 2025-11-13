import { Box, Button, Modal, Tabs } from '@navikt/ds-react'
import { useRef, useState } from 'react'

import { useUmami } from '../../../sporing/useUmami.ts'
import { Hjelpemiddel } from '../../../types/BehovsmeldingTypes.ts'
import { Produkt } from '../../../types/types.internal.ts'
import {
  AlternativeProduct,
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
} from '../useAlternativeProdukter.ts'
import { AlternativeProdukterTabPanel } from './alternativtProdukt/AlternativeProdukterTabPanel.tsx'
import { EndreArtikkelData, EndretHjelpemiddelRequest } from './endreHjelpemiddelTypes.ts'
import { ManueltSøkPanel } from './endreHmsNr/ManueltSøkTabPanel.tsx'
import { OriginaltHjelpemiddel } from './OriginaltHjelpemiddel.tsx'
import { FormProvider, useForm } from 'react-hook-form'
import { EndretHjelpemiddelBegrunnelse, EndretHjelpemiddelBegrunnelseLabel } from './endreProduktTypes.ts'

interface AlternativProduktModalProps {
  åpen: boolean
  hjelpemiddel: Hjelpemiddel
  nåværendeHmsnr: string
  grunndataProdukt: Produkt | undefined
  alternativeProdukter?: AlternativeProduct[]
  harAlternativeProdukter: boolean
  harOppdatertLagerstatus: boolean
  onLagre(endreHjelpemiddel: EndretHjelpemiddelRequest): void | Promise<void>
  onLukk(): void
}

export const PAGE_SIZE = 6

export function EndreHjelpemiddelModal(props: AlternativProduktModalProps) {
  const {
    åpen,
    hjelpemiddel,
    nåværendeHmsnr,
    grunndataProdukt,
    alternativeProdukter: alternativeProdukterInitial = ingenAlternativeProdukterForHmsArtNr,
    harOppdatertLagerstatus,
    harAlternativeProdukter,
    onLagre,
    onLukk,
  } = props
  const [activeTab, setActiveTab] = useState('alternativer')
  const [produktValgt, setProduktValgt] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { logSkjemaFullført } = useUmami()
  const ref = useRef<HTMLDialogElement>(null)
  const { logKnappKlikket } = useUmami()

  const {
    isLoading,
    alternativeProdukterByHmsArtNr,

    harPaginering,
    pageNumber,
    pageSize,
    totalElements,
    onPageChange,
  } = useAlternativeProdukter(åpen && !harOppdatertLagerstatus ? [hjelpemiddel.produkt.hmsArtNr] : [], PAGE_SIZE, false)

  const alternativeProdukter = harOppdatertLagerstatus
    ? alternativeProdukterInitial
    : (alternativeProdukterByHmsArtNr[hjelpemiddel.produkt.hmsArtNr] ?? ingenAlternativeProdukterForHmsArtNr)

  const form = useForm<EndreArtikkelData>({
    defaultValues: {
      endretProdukt: '',
      produktMangler: false,
      endreBegrunnelse: '',
      endreBegrunnelseFritekst: '',
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    if (data.produktMangler) {
      return
    }
    if (!produktValgt) {
      setProduktValgt(true)
    } else {
      logSkjemaFullført({
        komponent: 'EndreHjelpemiddelModal',
        valgtAlternativ: data.endretProdukt,
      })
      await handleSubmit(data)
      setProduktValgt(false)
    }
  })

  const handleSubmit = async (data: EndreArtikkelData) => {
    try {
      setSubmitting(true)
      const begrunnelse = data.endreBegrunnelse as EndretHjelpemiddelBegrunnelse
      const begrunnelseFritekst =
        begrunnelse === EndretHjelpemiddelBegrunnelse.ANNET ||
        begrunnelse === EndretHjelpemiddelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
          ? data.endreBegrunnelseFritekst
          : EndretHjelpemiddelBegrunnelseLabel.get(begrunnelse)
      await onLagre({
        hjelpemiddelId: hjelpemiddel.hjelpemiddelId,
        hmsArtNr: data.endretProdukt ?? '',
        begrunnelse,
        begrunnelseFritekst,
      })
      form.reset()
      if (harAlternativeProdukter) {
        setActiveTab('alternativer')
      }
      onLukk()
    } finally {
      setSubmitting(false)
    }
  }

  const handleTabChange = (newTab: string) => {
    form.reset()
    setProduktValgt(false)
    setActiveTab(newTab)
  }

  const handleCancel = () => {
    logKnappKlikket({
      komponent: 'AlternativeProdukterModal',
      tekst: 'Avbryt endre til alternativt produkt',
    })
    form.reset()
    onLukk()
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Modal
          ref={ref}
          placement="top"
          closeOnBackdropClick={false}
          width="1200px"
          open={åpen}
          onClose={() => {
            onLukk()
          }}
          header={{ heading: 'Endre hjelpemiddel' }}
          size="small"
          aria-label={'Endre hjelpemiddel'}
        >
          <Modal.Body style={{ scrollbarGutter: 'stable both-edges' }}>
            <Box.New paddingBlock="space-24 0" paddingInline="space-16">
              <OriginaltHjelpemiddel
                navn={hjelpemiddel.produkt.artikkelnavn}
                hmsnr={hjelpemiddel.produkt.hmsArtNr}
                opplysninger={hjelpemiddel.opplysninger}
                grunndataProdukt={grunndataProdukt}
              />

              {harAlternativeProdukter ? (
                <Box.New paddingBlock="space-24 0">
                  <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tabs.List>
                      <Tabs.Tab value="alternativer" label="Alternativer på lager" />
                      <Tabs.Tab value="manuelt" label="Søk manuelt" />
                    </Tabs.List>

                    <Tabs.Panel value="alternativer">
                      <AlternativeProdukterTabPanel
                        alternativeProdukter={alternativeProdukter}
                        isLoading={isLoading}
                        harPaginering={harPaginering}
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        totalElements={totalElements}
                        onPageChange={onPageChange}
                        produktValgt={produktValgt}
                      />
                    </Tabs.Panel>
                    <Tabs.Panel value="manuelt">
                      <ManueltSøkPanel
                        hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
                        hmsArtNr={hjelpemiddel.produkt.hmsArtNr}
                        nåværendeHmsnr={nåværendeHmsnr}
                        produktValgt={produktValgt}
                      />
                    </Tabs.Panel>
                  </Tabs>
                </Box.New>
              ) : (
                <ManueltSøkPanel
                  hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
                  hmsArtNr={hjelpemiddel.produkt.hmsArtNr}
                  nåværendeHmsnr={nåværendeHmsnr}
                  produktValgt={produktValgt}
                />
              )}
            </Box.New>
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
                setProduktValgt(false)
                handleCancel()
              }}
            >
              Avbryt
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
    </FormProvider>
  )
}

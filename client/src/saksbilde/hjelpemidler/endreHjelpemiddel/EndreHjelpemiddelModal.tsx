import { Box, Button, Dialog, Tabs } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import classes from './EndreModal.module.css'

import { EndretArtikkelBegrunnelse, EndretArtikkelBegrunnelseLabel } from '../../../sak/sakTypes.ts'
import { useUmami } from '../../../sporing/useUmami.ts'
import { Hjelpemiddel } from '../../../types/BehovsmeldingTypes.ts'
import { Produkt } from '../../../types/types.internal.ts'
import {
  type AlternativeProduct,
  ingenAlternativeProdukterForHmsArtNr,
  useAlternativeProdukter,
} from '../useAlternativeProdukter.ts'
import { AlternativeProdukterTabPanel } from './alternativtProdukt/AlternativeProdukterTabPanel.tsx'
import { type EndreArtikkelData, type EndreHjelpemiddelRequest } from './endreHjelpemiddelTypes.ts'
import { ManueltSøkPanel } from './endreHmsNr/ManueltSøkTabPanel.tsx'
import { OriginaltHjelpemiddel } from './OriginaltHjelpemiddel.tsx'
import { useHjelpemiddel } from './useHjelpemiddel.ts'

interface AlternativProduktModalProps {
  åpen: boolean
  hjelpemiddel: Hjelpemiddel
  nåværendeHmsnr: string
  grunndataProdukt: Produkt | undefined
  alternativeProdukter?: AlternativeProduct[]
  harAlternativeProdukter: boolean
  harOppdatertLagerstatus: boolean
  onLagre(endreHjelpemiddel: EndreHjelpemiddelRequest): void | Promise<void>
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
      endreBegrunnelse: '',
      endreBegrunnelseFritekst: '',
    },
  })

  const endreProduktHmsnr = form.watch('endretProdukt') || ''
  const { error: produktError } = useHjelpemiddel(endreProduktHmsnr)

  const onSubmit = form.handleSubmit(async (data) => {
    if (produktError) {
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
      const begrunnelse = data.endreBegrunnelse as EndretArtikkelBegrunnelse
      const begrunnelseFritekst =
        begrunnelse === EndretArtikkelBegrunnelse.ANNET ||
        begrunnelse === EndretArtikkelBegrunnelse.ALTERNATIV_PRODUKT_ANNET
          ? data.endreBegrunnelseFritekst
          : EndretArtikkelBegrunnelseLabel[begrunnelse]
      await onLagre({
        id: hjelpemiddel.hjelpemiddelId,
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
      <Dialog open={åpen} onOpenChange={(nextOpen) => !nextOpen && onLukk()} size="small">
        <Dialog.Popup
          closeOnOutsideClick={false}
          width="1200px"
          aria-label="Endre hjelpemiddel"
          style={{ marginBlockStart: '2em' }}
        >
          <form onSubmit={onSubmit} className={classes.form}>
            <Dialog.Header>
              <Dialog.Title>Endre hjelpemiddel</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body className={classes.modalBody}>
              <Box paddingBlock="space-24 space-0" paddingInline="space-16">
                <OriginaltHjelpemiddel
                  navn={hjelpemiddel.produkt.artikkelnavn}
                  hmsnr={hjelpemiddel.produkt.hmsArtNr}
                  opplysninger={hjelpemiddel.opplysninger}
                  grunndataProdukt={grunndataProdukt}
                />

                {harAlternativeProdukter ? (
                  <Box paddingBlock="space-24 space-0">
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
                  </Box>
                ) : (
                  <ManueltSøkPanel
                    hjelpemiddelId={hjelpemiddel.hjelpemiddelId}
                    hmsArtNr={hjelpemiddel.produkt.hmsArtNr}
                    nåværendeHmsnr={nåværendeHmsnr}
                    produktValgt={produktValgt}
                  />
                )}
              </Box>
            </Dialog.Body>
            <Dialog.Footer>
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
            </Dialog.Footer>
          </form>
        </Dialog.Popup>
      </Dialog>
    </FormProvider>
  )
}

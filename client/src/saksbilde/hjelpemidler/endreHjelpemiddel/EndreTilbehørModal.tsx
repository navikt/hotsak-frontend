import { Box, Button, Modal } from '@navikt/ds-react'
import { useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { EndretArtikkelBegrunnelse, EndretArtikkelBegrunnelseLabel } from '../../../sak/sakTypes.ts'
import { useUmami } from '../../../sporing/useUmami.ts'
import { type Tilbehør } from '../../../types/BehovsmeldingTypes.ts'
import { type Produkt } from '../../../types/types.internal.ts'
import { type EndreArtikkelData, type EndreHjelpemiddelRequest } from './endreHjelpemiddelTypes.ts'
import { ManueltSøkPanel } from './endreHmsNr/ManueltSøkTabPanel.tsx'
import { OriginaltHjelpemiddel } from './OriginaltHjelpemiddel.tsx'

interface AlternativProduktModalProps {
  åpen: boolean
  tilbehør: Tilbehør
  nåværendeHmsnr: string
  grunndataProdukt: Produkt | undefined
  onLagre(endreHjelpemiddel: EndreHjelpemiddelRequest): void | Promise<void>
  onLukk(): void
}

export const PAGE_SIZE = 6

export function EndreTilbehørModal(props: AlternativProduktModalProps) {
  const { åpen, tilbehør, nåværendeHmsnr, grunndataProdukt, onLagre, onLukk } = props
  const [produktValgt, setProduktValgt] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { logSkjemaFullført } = useUmami()
  const ref = useRef<HTMLDialogElement>(null)

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

  const handleCancel = () => {
    form.reset()
    onLukk()
  }

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
        id: tilbehør.tilbehørId!,
        hmsArtNr: data.endretProdukt ?? '',
        begrunnelse,
        begrunnelseFritekst,
      })
      form.reset()

      onLukk()
    } finally {
      setSubmitting(false)
    }
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
          header={{ heading: 'Endre tilbehør' }}
          size="small"
          aria-label={'Endre tilbehør'}
        >
          <Modal.Body style={{ scrollbarGutter: 'stable both-edges' }}>
            <Box paddingBlock="space-24 0" paddingInline="space-16">
              <OriginaltHjelpemiddel
                navn={tilbehør.navn}
                hmsnr={tilbehør.hmsArtNr}
                opplysninger={tilbehør.opplysninger}
                grunndataProdukt={grunndataProdukt}
              />
              <ManueltSøkPanel
                hjelpemiddelId={tilbehør.tilbehørId!}
                hmsArtNr={tilbehør.hmsArtNr}
                nåværendeHmsnr={nåværendeHmsnr}
                produktValgt={produktValgt}
              />
            </Box>
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

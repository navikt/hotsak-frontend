import { Alert, HelpText, HStack, TextField } from '@navikt/ds-react'
import { BekreftelseModal } from '../../../saksbilde/komponenter/BekreftelseModal'
import { VedtaksResultat } from '../behandling/behandlingTyper'
import { FormProvider, useForm } from 'react-hook-form'
import { storForbokstavIAlleOrd } from '../../../utils/formater'
import { useState } from 'react'
import { useBehandlingActions } from '../behandling/useBehandlingActions'
import { useToast } from '../../../felleskomponenter/toast/ToastContext'
import { Sak } from '../../../types/types.internal'
import { Etikett, Tekst } from '../../../felleskomponenter/typografi'

interface VedtakFormValues {
  problemsammendrag: string
}

export function FattVedtakModal({
  open,
  onClose,
  sak,
  vedtaksResultat,
}: {
  open: boolean
  onClose: () => void
  sak: Sak
  vedtaksResultat?: VedtaksResultat
}) {
  const [vedtakLoader, setVedtakLoader] = useState(false)
  const { ferdigstillBehandling } = useBehandlingActions()
  const { showSuccessToast } = useToast()

  const form = useForm<VedtakFormValues>({
    defaultValues: {
      problemsammendrag: `${storForbokstavIAlleOrd(sak?.søknadGjelder.replace('Søknad om:', '').trim())}; ${sak?.sakId}`,
    },
  })

  const fattVedtak = async (data: VedtakFormValues) => {
    setVedtakLoader(true)
    await ferdigstillBehandling(data.problemsammendrag)
    setVedtakLoader(false)
    showSuccessToast('Vedtak fattet')
    onClose()
  }

  return (
    <BekreftelseModal
      heading={
        'Vil du ' +
        (vedtaksResultat == VedtaksResultat.DELVIS_INNVILGET
          ? 'delvis innvilge'
          : vedtaksResultat == VedtaksResultat.AVSLÅTT
            ? 'avslå'
            : 'innvilge') +
        ' søknaden?'
      }
      loading={vedtakLoader}
      open={open}
      width="700px"
      bekreftButtonLabel={
        (vedtaksResultat === VedtaksResultat.DELVIS_INNVILGET
          ? 'Delvis innvilg'
          : vedtaksResultat === VedtaksResultat.AVSLÅTT
            ? 'Avslå'
            : 'Innvilg') + ' søknaden'
      }
      onBekreft={form.handleSubmit(fattVedtak)}
      onClose={onClose}
    >
      {vedtaksResultat !== VedtaksResultat.AVSLÅTT && (
        <>
          <Tekst spacing>
            Når du {vedtaksResultat === VedtaksResultat.DELVIS_INNVILGET ? 'delvis innvilger' : 'innvilger'} søknaden
            vil det opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket på innlogget side på nav.no
          </Tekst>
          {vedtaksResultat == VedtaksResultat.DELVIS_INNVILGET && (
            <Alert variant="info" size="small" style={{ margin: '1em 0' }}>
              Når du delvis innvilger må du huske å redigere hjepemidlene i serviceforespøreselen i OeBS før du
              oppretter ordre.
            </Alert>
          )}
          <FormProvider {...form}>
            <TextField
              label={
                <HStack wrap={false} gap="2" align="center">
                  <Etikett>Tekst til problemsammendrag i SF i OeBS</Etikett>
                  <HelpText strategy="fixed">
                    <Tekst>
                      Foreslått tekst oppfyller registreringsinstruksen. Du kan redigere teksten i problemsammendraget
                      dersom det er nødvendig. Det kan du gjøre i feltet nedenfor før saken innvilges eller inne på SF i
                      OeBS som tidligere.
                    </Tekst>
                  </HelpText>
                </HStack>
              }
              size="small"
              {...form.register('problemsammendrag', { required: 'Feltet er påkrevd' })}
            />
          </FormProvider>
        </>
      )}
      {vedtaksResultat == VedtaksResultat.AVSLÅTT && (
        <>
          <Tekst spacing>
            Når du avslår søknaden vil det naturligvis ikke opprettes en serviceforespørsel (SF) i OeBS. Bruker
            underrettes med brevet du har forfattet. Innbygger kan også se vedtaket på innlogget side på nav.no
          </Tekst>
        </>
      )}
    </BekreftelseModal>
  )
}

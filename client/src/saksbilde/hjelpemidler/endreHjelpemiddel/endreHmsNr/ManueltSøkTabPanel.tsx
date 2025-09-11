import { Button, Heading, Modal } from '@navikt/ds-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { BegrunnelseForBytte } from '../BegrunnelseForBytte'
import { EndreArtikkelData, EndreHjelpemiddelType } from '../endreHjelpemiddelTypes'
import { HmsNrVelger } from './HmsNrVelger'

export function ManueltSøkPanel({
  hmsArtNr,
  onSubmit,
  onCancel,
  submitting,
}: {
  hjelpemiddelId: string
  hmsArtNr: string
  onSubmit: (data: EndreArtikkelData) => Promise<void>
  onCancel: () => void
  submitting: boolean
}) {
  const [produktValgt, setProdukterValgt] = useState(false)

  const methods = useForm<EndreArtikkelData>({
    defaultValues: {
      endretProdukt: [],
      endreBegrunnelse: '',
      endreBegrunnelseFritekst: '',
    },
  })

  const endretProdukt = methods.watch('endretProdukt.0')

  const handleFormSubmit = async (data: EndreArtikkelData) => {
    if (!produktValgt) {
      setProdukterValgt(true)
    } else {
      await onSubmit(data)
      setProdukterValgt(false)
    }
  }

  console.log('!produktValgt', !produktValgt, 'lengde', endretProdukt?.length !== 6)

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          {!produktValgt ? (
            <>
              <Heading level="1" size="small">
                Endre HMS nummer
              </Heading>
              <HmsNrVelger
                //hjelpemiddelId={hjelpemiddelId}
                hmsArtNr={hmsArtNr}
                nåværendeHmsArtNr={'TODO'}
              />
            </>
          ) : (
            <>
              <Heading level="1" size="small">
                Velg begrunnelse for å bytte hjelpemiddel
              </Heading>
              <BegrunnelseForBytte type={EndreHjelpemiddelType.ENDRE_HMS_NUMMER} />
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            type="submit"
            variant="primary"
            size="small"
            loading={submitting}
            //disabled={!produktValgt && endretProdukt?.length !== 6}
          >
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

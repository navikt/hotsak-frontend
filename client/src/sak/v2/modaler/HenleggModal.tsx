import { useState } from 'react'

import { InfoCard, List, VStack } from '@navikt/ds-react'

import { useBrevForSak } from '../../../brev/useBrev'
import { Tekst } from '../../../felleskomponenter/typografi'
import { usePerson } from '../../../personoversikt/usePerson'
import { BekreftelsesDialog } from '../../../saksbilde/komponenter/BekreftelsesDialog'
import { type Sak } from '../../../types/types.internal'
import { useSakContext } from '../SakV2ContextType'
import { Henleggelsesårsak } from '../behandling/behandlingTyper'

export interface HenleggModalProps {
  open: boolean
  onClose(): void
  sak: Sak
  årsak?: Henleggelsesårsak
}

export function HenleggModal({ open, onClose, sak, årsak }: HenleggModalProps) {
  const [loading, setLoading] = useState(false)
  const { henleggFormRef } = useSakContext()
  const { harBrev } = useBrevForSak(sak.sakId)
  const { personInfo } = usePerson(sak.bruker.fnr)
  const vergemål = personInfo?.vergemål || []

  const årsakerMedBegrunnelse = [
    Henleggelsesårsak.TRUKKET_AV_BEGRUNNER,
    Henleggelsesårsak.FLERE_SØKNADER_SAMME_BEHOV,
    Henleggelsesårsak.ANNET,
  ]
  const harBegrunnelse = årsak !== undefined && årsakerMedBegrunnelse.includes(årsak)

  return (
    <BekreftelsesDialog
      heading="Vil du lukke  saken?"
      loading={loading}
      width="800px"
      open={open}
      reverserKnapperekkefølge={true}
      bekreftButtonLabel={`${harBegrunnelse ? 'Journalfør notat og lukk saken' : 'Lukk saken'}`}
      onBekreft={async () => {
        setLoading(true)
        const success = await henleggFormRef.current?.submit()
        setLoading(false)
        if (success) {
          onClose()
        }
      }}
      onClose={onClose}
    >
      <VStack gap="space-12">
        {harBrev && (
          <InfoCard data-color="info" size="small">
            <InfoCard.Header>
              <InfoCard.Title>
                Du er i ferd med å sende ut et brev til bruker{vergemål.length > 0 ? ' og verge' : ''}
              </InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
              <Tekst>Brevet vil bli sendt ut neste virkedag.</Tekst>
            </InfoCard.Content>
          </InfoCard>
        )}
        {harBegrunnelse && (
          <InfoCard data-color="info" size="small">
            <InfoCard.Header>
              <InfoCard.Title>Husk at innbygger kan be om innsyn i begrunnelsen din</InfoCard.Title>
            </InfoCard.Header>
            <InfoCard.Content>
              <List>
                <List.Item>Begrunnelsen din lagres som et internt forvaltningsnotat</List.Item>
                <List.Item>
                  Innbygger får ikke varsel om at saken er lukket, men vil kunne se i saksoversikten sin på innloggede
                  sider at saken er lukket.
                </List.Item>
                <List.Item>
                  Innbygger ser ikke notatet med begrunnelsen, men notatet kan bli utlevert hvis innbygger ber om innsyn
                  i egen sak.
                </List.Item>
              </List>
            </InfoCard.Content>
          </InfoCard>
        )}
      </VStack>
    </BekreftelsesDialog>
  )
}

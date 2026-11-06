import { ChevronDownIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, Tabs, Tag, VStack } from '@navikt/ds-react'
import { type ReactNode, useState } from 'react'
import { useMiljø } from '../utils/useMiljø.ts'

import { Strek } from '../felleskomponenter/Strek.tsx'
import { Etikett, Tekst } from '../felleskomponenter/typografi.tsx'
import { usePerson, UsePersonResponse } from '../personoversikt/usePerson.ts'
import { formaterNavn, storForbokstavIOrd } from '../utils/formater.ts'
import { isVedtaksbrev } from './brevSelectors.ts'
import { type Brev, BrevmalTekst, type BrevmottakerResponse } from './brevTyper.ts'
import { DelKopiMedFormidler } from './DelKopiMedFormidler.tsx'
import { useBrevmottakere } from './useBrev.ts'

export interface BrevHeaderProps {
  brev: Brev[]
  valgtBrevId?: string
  onVelgBrev(brevId: string): void
  kanRedigere?: boolean
  handlinger?: ReactNode
  onSlettUtkast?(): void
}

export function BrevHeader({
  brev,
  valgtBrevId,
  onVelgBrev,
  kanRedigere = false,
  handlinger,
  onSlettUtkast,
}: BrevHeaderProps) {
  const { erIkkeProd } = useMiljø()
  const [innstillingerÅpen, setInnstillingerÅpen] = useState(false)
  const { data } = useBrevmottakere(brev.find((b) => b.brevId === valgtBrevId)?.brevId)
  const erVedtaksbrevValgt = brev.some((b) => b.brevId === valgtBrevId && isVedtaksbrev(b))
  const flereMottakere = (data?.brevmottakere?.length ?? 0) > 1
  const erUtkastValgt = brev.some((b) => b.brevId === valgtBrevId && b.brevstatus === 'UTKAST')
  const brukerMottaker = data && data.brevmottakere?.find((m) => m.mottakertype === 'BRUKER')
  const brukerPersonInfo = usePerson(brukerMottaker?.fnr)

  return (
    <Box borderRadius="12" marginBlock="space-0 space-4">
      <Tabs value={valgtBrevId ?? ''} onChange={onVelgBrev} size="small">
        <Tabs.List>
          {brev.map((b) => (
            <Tabs.Tab key={b.brevId} value={b.brevId} label={BrevmalTekst[b.brevmal]} />
          ))}
          {erIkkeProd && (
            <Tabs.Tab
              key="nytt-utkast"
              value="nytt-utkast"
              label="Nytt utkast"
              icon={<PlusCircleIcon fontSize="1.5rem" />}
            />
          )}
        </Tabs.List>
      </Tabs>
      {valgtBrevId && valgtBrevId != 'nytt-utkast' && (
        <Box padding="space-8">
          <HStack justify="space-between">
            <HStack gap="space-4">
              <>
                {erUtkastValgt && (
                  <Button
                    variant="tertiary"
                    size="small"
                    aria-expanded={innstillingerÅpen}
                    onClick={() => setInnstillingerÅpen(!innstillingerÅpen)}
                    icon={<ChevronDownIcon fontSize="1.3rem" />}
                  >
                    Innstillinger
                  </Button>
                )}
                {flereMottakere && (
                  <Tag variant="moderate" data-color="warning" size="small">
                    Flere mottakere
                  </Tag>
                )}
              </>
            </HStack>
            <HStack gap="space-4">{handlinger}</HStack>
          </HStack>
        </Box>
      )}
      {innstillingerÅpen && erUtkastValgt && (
        <BrevHeaderInnstillinger
          key={valgtBrevId}
          valgtBrevId={valgtBrevId}
          mottakere={data}
          kanRedigere={kanRedigere}
          brukerPersonInfo={brukerPersonInfo}
          vedtaksbrev={erVedtaksbrevValgt}
          onSlettUtkast={onSlettUtkast}
        />
      )}
      <Strek style={{ marginBlock: 0 }} />
    </Box>
  )
}

interface BrevHeaderInnstillingerProps {
  valgtBrevId?: string
  mottakere?: BrevmottakerResponse
  kanRedigere: boolean
  vedtaksbrev: boolean
  brukerPersonInfo?: UsePersonResponse
  onSlettUtkast?(): void
}

export function BrevHeaderInnstillinger({
  valgtBrevId,
  mottakere,
  kanRedigere,
  vedtaksbrev,
  brukerPersonInfo,
  onSlettUtkast,
}: BrevHeaderInnstillingerProps) {
  const vergemål = brukerPersonInfo?.personInfo?.vergemål || []
  const { erIkkeProd } = useMiljø()
  const vergeNavn = vergemål
    .map((it) => it.navn)
    .filter((navn): navn is NonNullable<typeof navn> => !!navn)
    .map((navn) => formaterNavn(navn))
    .join(', ')

  return (
    <Box padding="space-20">
      <VStack gap="space-8">
        <Heading level="2" size="xsmall">
          Innstillinger for brevet
        </Heading>
        {vedtaksbrev && mottakere && erIkkeProd && (
          <DelKopiMedFormidler brevId={valgtBrevId} mottakere={mottakere} kanRedigere={kanRedigere} />
        )}
        <Heading level="3" size="xsmall">
          Mottakere
        </Heading>
        {mottakere &&
          mottakere.brevmottakere.map((mottaker) => (
            <VStack key={mottaker.id}>
              <Etikett>{storForbokstavIOrd(mottaker.mottakertype)}</Etikett>
              <Tekst>
                {(mottaker.navn ??
                  (mottaker.mottakertype == 'BRUKER'
                    ? formaterNavn(brukerPersonInfo?.personInfo?.navn)
                    : mottaker.mottakertype == 'VERGE'
                      ? vergeNavn
                      : '-')) ||
                  '-'}
              </Tekst>
            </VStack>
          ))}
        {kanRedigere && onSlettUtkast && (
          <HStack justify="end">
            <Button variant="tertiary" data-color="danger" size="small" onClick={onSlettUtkast} icon={<TrashIcon />}>
              Slett utkast
            </Button>
          </HStack>
        )}
      </VStack>
    </Box>
  )
}

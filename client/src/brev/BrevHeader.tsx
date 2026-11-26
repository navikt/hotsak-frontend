import { ChevronDownIcon, ChevronUpIcon, PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons'
import { Box, Button, Checkbox, CheckboxGroup, Heading, HStack, Tabs, Tag, VStack } from '@navikt/ds-react'
import { type ReactNode, useState } from 'react'
import { useMiljø } from '../utils/useMiljø.ts'

import { useFlag } from '@unleash/toolbar/next'
import { Strek } from '../felleskomponenter/Strek.tsx'
import { Etikett, Tekst } from '../felleskomponenter/typografi.tsx'
import { usePerson, type UsePersonResponse } from '../personoversikt/usePerson.ts'
import { FeatureToggle } from '../unleash/FeatureToggle.ts'
import { formaterNavn, storForbokstavIOrd } from '../utils/formater.ts'
import { erFormidlerAlltidMottaker, isVedtaksbrev } from './brevSelectors.ts'
import { type Brev, BrevmalTekst, type BrevmottakerResponse } from './brevTyper.ts'
import { DelKopiMedFormidler } from './DelKopiMedFormidler.tsx'
import { useBrevmottakere } from './useBrev.ts'
import { type BrukerSomMottaker } from './useBrukerSomMottaker.ts'

export interface BrevHeaderProps {
  brev: Brev[]
  valgtBrevId?: string
  onVelgBrev(brevId: string): void
  kanRedigere?: boolean
  handlinger?: ReactNode
  oppgaveErUnderBehandlingAvInnloggetAnsatt?: boolean
  onSlettUtkast?(): void
  brukerSomMottaker?: BrukerSomMottaker
}

export function BrevHeader({
  brev,
  valgtBrevId,
  onVelgBrev,
  kanRedigere = false,
  handlinger,
  oppgaveErUnderBehandlingAvInnloggetAnsatt,
  onSlettUtkast,
  brukerSomMottaker,
}: BrevHeaderProps) {
  const { erIkkeProd } = useMiljø()
  const erPilot = useFlag(FeatureToggle.journalforing) || erIkkeProd
  const [innstillingerÅpen, setInnstillingerÅpen] = useState(false)
  const { data } = useBrevmottakere(brev.find((b) => b.brevId === valgtBrevId)?.brevId)
  const erVedtaksbrevValgt = brev.some((b) => b.brevId === valgtBrevId && isVedtaksbrev(b))
  const flereMottakere = (data?.brevmottakere?.length ?? 0) > 1
  const erUtkastValgt = brev.some((b) => b.brevId === valgtBrevId && b.brevstatus === 'UTKAST')
  const brukerMottaker = data && data.brevmottakere?.find((m) => m.mottakertype === 'BRUKER')
  const brukerPersonInfo = usePerson(brukerMottaker?.fnr)
  const valgtBrev = brev.find((b) => b.brevId === valgtBrevId)

  return (
    <Box borderRadius="12" marginBlock="space-0 space-4">
      {erPilot && (
        <Tabs value={valgtBrevId ?? ''} onChange={onVelgBrev} size="small">
          <Tabs.List>
            {brev.map((b) => (
              <Tabs.Tab key={b.brevId} value={b.brevId} label={BrevmalTekst[b.brevmal]} />
            ))}
            {oppgaveErUnderBehandlingAvInnloggetAnsatt && (
              <Tabs.Tab
                key="nytt-utkast"
                value="nytt-utkast"
                label="Nytt utkast"
                icon={<PlusCircleIcon fontSize="1.5rem" />}
              />
            )}
          </Tabs.List>
        </Tabs>
      )}
      {valgtBrevId && valgtBrevId != 'nytt-utkast' && handlinger && (
        <Box padding="space-8">
          <HStack justify="space-between">
            <HStack gap="space-4">
              <>
                {erUtkastValgt && erPilot && (
                  <Button
                    variant="tertiary"
                    size="small"
                    aria-expanded={innstillingerÅpen}
                    onClick={() => setInnstillingerÅpen(!innstillingerÅpen)}
                    icon={
                      innstillingerÅpen ? <ChevronUpIcon fontSize="1.3rem" /> : <ChevronDownIcon fontSize="1.3rem" />
                    }
                  >
                    Innstillinger
                  </Button>
                )}
                {kanRedigere && onSlettUtkast && !erPilot && (
                  <Button variant="tertiary" size="small" onClick={onSlettUtkast}>
                    Slett utkast
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
          brukerSomMottaker={brukerSomMottaker}
          formidlerErObligatorisk={erFormidlerAlltidMottaker(valgtBrev?.brevmal)}
          vedtaksbrev={erVedtaksbrevValgt}
          onSlettUtkast={onSlettUtkast}
        />
      )}
      {handlinger && <Strek style={{ marginBlock: 0 }} />}
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
  brukerSomMottaker?: BrukerSomMottaker
  formidlerErObligatorisk?: boolean
}

export function BrevHeaderInnstillinger({
  valgtBrevId,
  mottakere,
  kanRedigere,
  brukerPersonInfo,
  onSlettUtkast,
  brukerSomMottaker,
  formidlerErObligatorisk = false,
}: BrevHeaderInnstillingerProps) {
  const vergemål = brukerPersonInfo?.personInfo?.vergemål || []
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
        {mottakere && (
          <DelKopiMedFormidler
            brevId={valgtBrevId}
            mottakere={mottakere}
            kanRedigere={kanRedigere}
            formidlerErObligatorisk={formidlerErObligatorisk}
          />
        )}
        {brukerSomMottaker && (
          <CheckboxGroup
            legend="Flere mottakere"
            hideLegend
            size="small"
            value={brukerSomMottaker.valgt ? ['bruker'] : []}
            onChange={(valgte: string[]) => brukerSomMottaker.velgBruker(valgte.includes('bruker'))}
          >
            <Checkbox
              value="bruker"
              disabled={!kanRedigere || !brukerSomMottaker.kanEndre}
              description="Eventuelle verger får også brevet."
            >
              Send også til bruker
            </Checkbox>
          </CheckboxGroup>
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
                      ? brukerSomMottaker
                        ? formaterNavn(vergemål.find((verge) => verge.fnr === mottaker.fnr)?.navn)
                        : vergeNavn
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

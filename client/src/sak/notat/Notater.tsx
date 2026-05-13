import '@mdxeditor/editor/style.css'
import { Box, Loader, ToggleGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { FilterChips } from '../../felleskomponenter/filter/FilterChips.tsx'
import type { FilterOption } from '../../felleskomponenter/filter/filterTypes.ts'
import { Mellomtittel, Tekst } from '../../felleskomponenter/typografi.tsx'
import { NotatType } from '../../types/types.internal.ts'
import { ForvaltningsnotatForm } from './ForvaltningsnotatForm.tsx'
import { InterntNotatForm } from './InterntNotatForm.tsx'
import { NotatCard } from './NotatCard.tsx'
import classes from './Notater.module.css'
import { Notatinformasjon } from './Notatinformasjon.tsx'
import { useNotater } from './useNotater.tsx'
import { Eksperiment } from '../../felleskomponenter/Eksperiment.tsx'

export interface NotaterProps {
  sakId: string
  lesevisning: boolean
}
export interface NotatFormValues {
  tittel: string
  tekst: string
}

export function Notater(props: NotaterProps) {
  const { sakId, lesevisning } = props
  const {
    notater,
    mutate: mutateNotater,
    isLoading: notaterLaster,
    harLastet: notaterLastet,
    finnAktivtUtkast,
  } = useNotater(sakId)
  const [notatType, setNotatType] = useState<NotatType>(NotatType.INTERNT)

  const aktivtUtkast = finnAktivtUtkast(notatType)

  const filterOptions: FilterOption[] = [
    { key: 'ALLE', label: 'Alle' },
    { key: NotatType.INTERNT, label: 'Internt arbeidsnotat' },
    { key: NotatType.JOURNALFØRT, label: 'Forvaltningsnotat' },
  ]
  const [filter, setFilter] = useState(['ALLE'])

  return (
    <>
      <VStack gap="space-8">
        <Notatinformasjon />
        <Box paddingBlock="space-24 space-0">
          <ToggleGroup
            size="small"
            value={notatType}
            label="Opprett nytt notat"
            onChange={(type) => setNotatType(type as NotatType)}
          >
            <Eksperiment>
              <ToggleGroup.Item value={'KOMMENTAR'} label="Kommentar" />
            </Eksperiment>
            <ToggleGroup.Item value={NotatType.INTERNT} label="Internt arbeidsnotat" />
            <ToggleGroup.Item value={NotatType.JOURNALFØRT} label="Forvaltningsnotat" />
          </ToggleGroup>
        </Box>
      </VStack>
      {notaterLaster && (
        <div>
          <Loader size="large" className={classes.loader} />
        </div>
      )}
      {notaterLastet && (
        <>
          {notatType === NotatType.JOURNALFØRT ? (
            <ForvaltningsnotatForm sakId={sakId} lesevisning={lesevisning} aktivtUtkast={aktivtUtkast} />
          ) : (
            <InterntNotatForm sakId={sakId} lesevisning={lesevisning} aktivtUtkast={aktivtUtkast} />
          )}
        </>
      )}
      <VStack gap="space-16" paddingBlock="space-32 space-0">
        <Mellomtittel spacing={false}>Notater knyttet til saken</Mellomtittel>
        {notaterLaster && (
          <div>
            <Loader size="large" className={classes.loader} />
          </div>
        )}
        {!notaterLaster && notater && (
          <>
            {notater.length === 0 && <Tekst>Ingen notater er knyttet til saken</Tekst>}
            {notater.length > 0 && (
              <FilterChips
                options={filterOptions}
                selected={filter}
                handleChange={(filterValue) => {
                  setFilter(filterValue)
                }}
              />
            )}
            {notater
              .filter((notat) => filter[0] === 'ALLE' || notat.type === filter[0])
              .map((notat) => (
                <NotatCard key={notat.id} notat={notat} mutate={mutateNotater} />
              ))}
          </>
        )}
      </VStack>
    </>
  )
}

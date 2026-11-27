import { ExternalLinkIcon } from '@navikt/aksel-icons'
import { BodyShort, HGrid, Loader } from '@navikt/ds-react'
import { Fragment } from 'react'

import { IconLink } from '../felleskomponenter/IconLink.tsx'
import { useArtiklerForOppgave } from '../oppgave/useArtiklerForOppgave.ts'
import { naturalBy } from '../utils/array.ts'
import { select } from '../utils/select.ts'
import classes from './OppgaveDetailsHjelpemidler.module.css'
import { OppgaveDetailsItem } from './OppgaveDetailsItem.tsx'

export interface OppgaveDetailsHjelpemidlerProps {
  sakId?: string
}

export function OppgaveDetailsHjelpemidler(props: OppgaveDetailsHjelpemidlerProps) {
  const { sakId } = props
  const { artikler, isLoading } = useArtiklerForOppgave(sakId)
  return (
    <OppgaveDetailsItem label="Hjelpemidler">
      {isLoading ? (
        <Loader />
      ) : (
        <HGrid gap="space-8" columns="min-content min-content min-content max-content" align="start">
          {artikler.length === 0 && (
            <BodyShort size="small" className={classes.text}>
              Ingen registrerte.
            </BodyShort>
          )}
          {artikler.map((artikkel) => (
            <Fragment key={artikkel.id ?? artikkel.hmsArtNr}>
              {artikkel.url ? (
                <BodyShort as={IconLink} icon={<ExternalLinkIcon />} href={artikkel.url} size="small" target="_blank">
                  {artikkel.hmsArtNr}
                </BodyShort>
              ) : (
                <BodyShort size="small">{artikkel.hmsArtNr}</BodyShort>
              )}
              <BodyShort size="small" className={classes.text}>
                {artikkel.artikkelnavn}
              </BodyShort>
              <BodyShort size="small" className={classes.text}>{`${artikkel.antall} stk`}</BodyShort>
              <ul className={classes.delkontrakter}>
                {artikkel.delkontrakter.length === 0 && (
                  <BodyShort as="li" size="small">
                    Ikke på avtale
                  </BodyShort>
                )}
                {artikkel.delkontrakter.toSorted(naturalBy(select('posttittel'))).map((delkontrakt, index) => (
                  <BodyShort as="li" size="small" key={index}>
                    {delkontrakt.rangering === 99 ? (
                      <>{`Delkontrakt ${delkontrakt.posttittel} | Ingen rangering.`}</>
                    ) : (
                      <>{`Delkontrakt ${delkontrakt.posttittel} | Rangering: ${delkontrakt.rangering}`}</>
                    )}
                  </BodyShort>
                ))}
              </ul>
            </Fragment>
          ))}
        </HGrid>
      )}
    </OppgaveDetailsItem>
  )
}

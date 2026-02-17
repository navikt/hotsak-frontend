import { BodyShort, HGrid, Link, Loader } from '@navikt/ds-react'
import { Fragment } from 'react'

import { useArtiklerForOppgave } from '../oppgave/useArtiklerForOppgave.ts'
import { naturalBy } from '../utils/array.ts'
import { select } from '../utils/select.ts'
import { OppgaveDetailsItem } from './OppgaveDetailsItem.tsx'

import classes from './OppgaveHjelpemidler.module.css'

export interface OppgaveHjelpemidlerProps {
  sakId?: Nullable<ID>
}

export function OppgaveHjelpemidler(props: OppgaveHjelpemidlerProps) {
  const { sakId } = props
  const { artikler, isLoading } = useArtiklerForOppgave(sakId)
  return (
    <OppgaveDetailsItem label="Hjelpemidler">
      {isLoading ? (
        <Loader />
      ) : (
        <HGrid gap="3" columns="min-content min-content min-content max-content">
          {artikler.map((artikkel) => (
            <Fragment key={artikkel.id ?? artikkel.hmsArtNr}>
              <BodyShort size="small">
                {artikkel.url ? (
                  <Link href={artikkel.url} target="_blank">
                    {artikkel.hmsArtNr}
                  </Link>
                ) : (
                  artikkel.hmsArtNr
                )}
              </BodyShort>
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

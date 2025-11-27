import { BodyShort, HGrid, Link, Loader } from '@navikt/ds-react'
import { Fragment } from 'react'

import { useArtiklerForOppgave } from '../../oppgave/useArtiklerForOppgave.ts'
import { natural } from '../../utils/array.ts'
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
        <HGrid gap="4" columns="min-content min-content min-content max-content">
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
                {artikkel.delkontrakter.toSorted(natural).map((delkontrakt, index) => (
                  <BodyShort as="li" size="small" key={index}>
                    {delkontrakt}
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
